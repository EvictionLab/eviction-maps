import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
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
import { csvParse } from 'd3-dsv';

import { DataAttributes } from '../map-tool/data/data-attributes';
import { DataLevels } from '../map-tool/data/data-levels';
import { environment } from '../../environments/environment';
import { PlatformService } from '../services/platform.service';
import { MapFeature } from '../map-tool/map/map-feature';
import { AnalyticsService } from '../services/analytics.service';

@Injectable()
export class DataService {
  dataLevels = DataLevels;
  dataAttributes = DataAttributes;
  /** Observable that emits when ready status is true */
  get ready() { return this._ready.asObservable().filter(r => !!r); }

  private _ready = new BehaviorSubject<boolean>(false);
  private mercator = new SphericalMercator({ size: 256 });
  private tileBase = environment.tileBaseUrl;
  private tilePrefix = 'evictions-';
  private tilesetYears = ['00', '10'];
  private queryZoom = 10;
  // Maps the length of GEOIDs to their respective layers
  private flagValues = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
    translate.onLangChange.subscribe((lang) => {
      this.updateLanguage(lang.translations);
      if (!this._ready.getValue()) {
        this._ready.next(true);
      }
    });
  }

  getDataAttribute(id: string) {
    const index = this.dataAttributes.findIndex(attr => attr.id === id);
    return this.dataAttributes[index];
  }

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

  /**
   * Gets the national data and transforms it into an object with attributes
   * for each year. (e.g. `{ 'e-00': 324, 'e-01': 350, ... }`)
   */
  getNationalData() {
    const columnMap = {
      'eviction-filings': 'ef',
      'evictions': 'e',
      'eviction-filing-rate': 'efr',
      'eviction-rate': 'er'
    };
    return this.http.get(environment.nationalDataUrl, { responseType: 'text' })
      .map(csvString => {
        const csvData = csvParse(csvString);
        return csvData.reduce((acc: any, cur) => {
          Object.keys(columnMap).forEach(c => {
            const newKey = columnMap[c] + '-' + cur['year'].toString().slice(-2);
            acc[newKey] = parseFloat(cur[c]);
          });
          return acc;
        }, {});
      });
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

  /** Updates the languge used in data attributes and levels */
  private updateLanguage(translations) {
    // translate census attribute names
    if (translations.hasOwnProperty('STATS')) {
      const stats = translations['STATS'];
      this.dataAttributes = this.dataAttributes.map((a) => {
        if (a.langKey) { a.name = stats[ a.langKey.split('.')[1] ]; }
        return a;
      });
    }
    // translate geography layers
    if (translations.hasOwnProperty('LAYERS')) {
      const layers = translations['LAYERS'];
      this.dataLevels = this.dataLevels.map((l) => {
        if (l.langKey) { l.name = layers[ l.langKey.split('.')[1] ]; }
        return l;
      });
    }
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
