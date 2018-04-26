import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as SphericalMercator from '@mapbox/sphericalmercator';
import * as vt from '@mapbox/vector-tile';
import * as Protobuf from 'pbf';
import inside from '@turf/inside';
import { point } from '@turf/helpers';
import * as bbox from '@turf/bbox';
import 'rxjs/add/observable/forkJoin';
import * as _isEqual from 'lodash.isequal';
import * as polylabel from 'polylabel';
import * as geoViewport from '@mapbox/geo-viewport';

import { environment } from '../../environments/environment';
import { PlatformService } from '../services/platform.service';
import { MapFeature } from '../map-tool/map/map-feature';
import { AnalyticsService } from '../services/analytics.service';

@Injectable()
export class DataService {

  private mercator = new SphericalMercator({ size: 256 });
  private tileBase = environment.tileBaseUrl;
  private tilePrefix = 'evictions-';
  private tilesetYears = ['00', '10'];
  private queryZoom = 10;
  // Maps the length of GEOIDs to their respective layers
  private flagValues = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  /**
   * Takes the GEOID and coordinates for an object, determines which
   * tile to request, parses it, and then returns the first feature
   * with the given GEOID
   *
   * @param geoid of the feature to query
   * @param lonLat array of [lon, lat]
   * @param multiYear specifies whether to merge multiple year tiles
   */
  getTileData(geoid: string, lonLat: number[], multiYear = false): Observable<MapFeature> {
    const layerId = this.getLayerFromGEOID(geoid);
    const queryZoom = this.getQueryZoom(layerId, lonLat);
    const coords = this.getXYFromLonLat(lonLat, queryZoom);
    const parseTile = this.getParser(geoid, layerId, lonLat, queryZoom, coords);

    if (multiYear) {
      const tileRequests = this.tilesetYears.map((y) => {
        return this.requestTile(layerId, coords, queryZoom, y).map(parseTile);
      });
      return Observable.forkJoin(tileRequests).map(this.mergeFeatureProperties.bind(this));
    } else {
      return this.requestTile(layerId, coords, queryZoom).map(parseTile);
    }
  }

  /** Gets the layer name based on the GEOID length */
  getLayerFromGEOID(geoid: string) {
    const geoidLayerMap = {
      2: 'states', 5: 'counties', 7: 'cities', 11: 'tracts', 12: 'block-groups'
    };
    return geoidLayerMap[geoid.length];
  }

  /** Gets the US average data */
  getUSAverage() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(environment.usAverageDataUrl, { headers: headers });
  }

  /**
   * Gets an observable of the 99th percentile data.
   * Stashes the 99th percentil data in a local BeviorSubject for future
   * requests.
   */
  getOutliers() {
    if (!this.flagValues.getValue()) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.get(environment.outliersDataUrl, { headers: headers })
        .do((data) => { this.flagValues.next(data); });
    }
    return this.flagValues.asObservable();
  }


  /**
   * Takes a feature returned from search and returns associated tile data
   * @param feat
   */
  getSearchTileData(feat: MapFeature): Observable<MapFeature> {
    const layerId = feat.properties.layerId as string;
    const lonLat = feat['center'] as number[];
    const queryZoom = this.getQueryZoom(layerId, lonLat);
    const coords = this.getXYFromLonLat(lonLat, queryZoom);

    const parseTile = this.getSearchParser(feat, queryZoom, coords);
    const tileRequests = this.tilesetYears.map((y) => {
      return this.requestTile(layerId, coords, queryZoom, y).map(parseTile);
    });
    return Observable.forkJoin(tileRequests).map(this.mergeFeatureProperties.bind(this));
  }

  /**
   * Processes the bounding box and properties of a feature returned
   * from the
   * @param layerId
   * @param feature
   */
  processMapFeature(feature: MapFeature, layerId?: string): MapFeature {
    // Add layer if specified or included on feature (usually on click)
    if (layerId) {
      feature.properties.layerId = layerId;
    } else if (feature['layer']) {
      feature.properties.layerId = feature['layer']['id'];
    }
    // Add bounding box
    feature.bbox = [
      +feature.properties['west'],
      +feature.properties['south'],
      +feature.properties['east'],
      +feature.properties['north']
    ];
    // Add evictions-per-day property
    Object.keys(feature.properties)
      .filter(p => p.startsWith('e-'))
      .forEach(p => {
        const evictions = +feature.properties[p];
        const yearSuffix = p.split('-').slice(1)[0];
        const daysInYear = +yearSuffix % 4 === 0 ? 366 : 365;
        const evictionsPerDay = evictions > 0 ? +(evictions / daysInYear).toFixed(2) : -1;
        feature.properties[`epd-${yearSuffix}`] = evictionsPerDay;
      });
    return feature;
  }

  /**
   * Requests a tile based on the provided layer, coordinates, and year
   * @param layerId
   * @param coords
   * @param queryZoom
   * @param year
   */
  private requestTile(layerId: string, coords: any, queryZoom, year = null) {
    const tilesetUrl = year ?
      this.tileBase + this.tilePrefix + layerId + '-' + year :
      this.tileBase + this.tilePrefix + layerId;
    return this.http.get(
      `${tilesetUrl}/${queryZoom}/${coords.x}/${coords.y}.pbf`,
      { responseType: 'arraybuffer' }
    );
  }

  /**
   * Merges the properties in an array of features
   * @param features an array of features
   */
  private mergeFeatureProperties(features: any[]) {
    const feat = features.find(f => f.hasOwnProperty('geometry'));
    for (let i = 1; i < this.tilesetYears.length; ++i) {
      feat['properties'] = { ...feat['properties'], ...features[i]['properties']};
    }
    return feat as MapFeature;
  }

  /**
   * Get the X/Y coords based on lonLat
   * @param lonLat
   * @param queryZoom
   */
  private getXYFromLonLat(lonLat, queryZoom) {
    const xyzCoords = this.mercator.xyz(
      [lonLat[0], lonLat[1], lonLat[0], lonLat[1]], queryZoom
    );
    return {
      x: Math.floor((xyzCoords.maxX + xyzCoords.minX) / 2),
      y: Math.floor((xyzCoords.maxY + xyzCoords.minY) / 2)
    };
  }

  /**
   * Tile parser for MapFeature objects returned from search
   * @param feat
   * @param queryZoom
   * @param coords
   */
  private getSearchParser(feat: MapFeature, queryZoom: number, coords: Object) {
    const layerId = feat.properties.layerId as string;
    const lonLat = feat['center'] as number[];
    const pt = point(lonLat);

    return (res: ArrayBuffer): MapFeature => {
      const tile = new vt.VectorTile(new Protobuf(res));
      const layer = tile.layers[layerId];
      const centerLayer = tile.layers[`${layerId}-centers`];

      const features = [...Array(layer.length)].fill(null).map((d, i) => {
        return layer.feature(i).toGeoJSON(coords['x'], coords['y'], queryZoom);
      });
      const centerFeatures = [...Array(centerLayer.length)].fill(null).map((d, i) => {
        return centerLayer.feature(i);
      });
      const containsPoint = features.filter(f => inside(pt, f));

      let matchFeat, centerFeat;
      // If looking for block groups, search only on geography
      // otherwise search on name and geography
      if (layerId === 'block-groups') {
        if (containsPoint.length > 0) {
          matchFeat = containsPoint[0];
        } else if (features.length > 0) {
          matchFeat = features[0];
        }
      } else {
        const featName = (feat.properties['label'] as string)
          .replace(',', '').toLowerCase();
        const featFirstWord = featName.split(' ')[0];
        const nameFilter = (f) => f.properties['n'].toLowerCase().includes(featName);
        const firstWordFilter = (f) => f.properties['n'].toLowerCase().includes(featFirstWord);

        const containsMatchName = containsPoint.find(nameFilter);
        const containsMatchFirst = containsPoint.find(firstWordFilter);
        const matchName = features.find(nameFilter);
        const matchFirst = features.find(firstWordFilter);

        if (containsMatchName) {
          matchFeat = containsMatchName;
        } else if (matchName) {
          matchFeat = matchName;
        } else if (containsMatchFirst) {
          matchFeat = containsMatchFirst;
        } else if (matchFirst) {
          matchFeat = matchFirst;
        }
      }

      if (matchFeat) {
        centerFeat = centerFeatures.find(f =>
          f.properties['GEOID'] === matchFeat.properties['GEOID']);
      }

      if (matchFeat && centerFeat) {
        matchFeat.properties = { ...matchFeat.properties, ...centerFeat.properties };
        return this.processMapFeature(matchFeat, layerId);
      }

      return {} as MapFeature;
    };
  }

  /**
   * Get the query zoom level depending on the layer and location
   * @param layerId
   * @param lonLat
   */
  private getQueryZoom(layerId: string, lonLat: number[]): number {
    // Special case for Alaska, which needs much lower zooms
    if (lonLat[1] > 50) {
      switch (layerId) {
        case 'states':
          return 2;
        case 'counties':
          return 2;
        case 'cities':
          return 4;
        default:
          return 8;
      }
    }
    switch (layerId) {
      case 'states':
        return 2;
      case 'counties':
        return 7;
      case 'cities':
        return 8;
      default:
        return 9;
    }
  }

  /**
   * Returns a function to parse the tile response from the tile HTTP request
   * @param geoid
   * @param layerId
   * @param lonLat
   * @param queryZoom
   * @param coords
   */
  private getParser(geoid, layerId, lonLat, queryZoom, coords) {
    return (res: ArrayBuffer): MapFeature => {
      const tile = new vt.VectorTile(new Protobuf(res));
      const layer = tile.layers[layerId];
      const centerLayer = tile.layers[`${layerId}-centers`];

      const features = [...Array(layer.length)].fill(null).map((d, i) => {
        return layer.feature(i).toGeoJSON(coords.x, coords.y, queryZoom);
      });
      const centerFeatures = [...Array(centerLayer.length)].fill(null).map((d, i) => {
        return centerLayer.feature(i);
      });

      const matchFeat = features.find(f => f.properties['GEOID'] === geoid);
      const centerFeat = centerFeatures.find(f => f.properties['GEOID'] === geoid);

      if (matchFeat && centerFeat) {
        matchFeat.properties = { ...matchFeat.properties, ...centerFeat.properties };
        return this.processMapFeature(matchFeat, layerId);
      }

      return {} as MapFeature;
    };
  }

}
