import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response, ResponseContentType } from '@angular/http';
import * as SphericalMercator from '@mapbox/sphericalmercator';
import * as vt from '@mapbox/vector-tile';
import * as Protobuf from 'pbf';
import * as inside from '@turf/inside';
import * as bbox from '@turf/bbox';
import 'rxjs/add/observable/forkJoin';
import * as _isEqual from 'lodash.isequal';
import * as polylabel from 'polylabel';

import { MapDataAttribute } from '../map-tool/map/map-data-attribute';
import { MapLayerGroup } from '../map-tool/map/map-layer-group';
import { MapDataObject } from '../map-tool/map/map-data-object';
import { MapFeature } from '../map-tool/map/map-feature';
import { DataAttributes, BubbleAttributes } from './data-attributes';
import { DataLevels } from './data-levels';

@Injectable()
export class DataService {
  get dataLevels() { return DataLevels; }
  get dataAttributes() { return DataAttributes; }
  get bubbleAttributes() { return BubbleAttributes; }
  activeYear;
  activeFeatures: MapFeature[] = [];
  activeDataLevel: MapLayerGroup = DataLevels[0];
  activeDataHighlight: MapDataAttribute = DataAttributes[0];
  activeBubbleHighlight: MapDataAttribute = BubbleAttributes[0];
  autoSwitchLayers = true;
  mapView;
  mapConfig;
  private mercator = new SphericalMercator({ size: 256 });
  private tileBase = 'https://s3.us-east-2.amazonaws.com/eviction-lab-tilesets/fixtures/';
  private tilePrefix = 'evictions-';
  private tilesetYears = ['90', '00', '10'];
  private queryZoom = 10;

  constructor(private http: Http) {}

  /**
   * Sets the choropleth layer based on the provided `DataAttributes` ID
   * @param id string corresponding to the `MapDataAttribute` in `DataAttributes`
   */
  setChoroplethHighlight(id: string) {
    const dataAttr = this.dataAttributes.find((attr) => attr.id === id);
    if (dataAttr) {
      this.activeDataHighlight = dataAttr;
    }
  }

  /**
   * Sets the bubble layer based on the provided `BubbleAttributes` ID
   * @param id string corresponding to the `MapDataAttribute` in `BubbleAttributes`
   */
  setBubbleHighlight(id: string) {
    const bubbleAttr = this.bubbleAttributes.find((attr) => attr.id === id);
    if (bubbleAttr) {
      this.activeBubbleHighlight = bubbleAttr;
    }
  }

  /**
   * Sets the layer geography based on the provided `DataLevels` ID
   * @param id string of the MapLayerGroup in `DataLevels`
   */
  setGeographyLevel(id: string) {
    const geoLevel = this.dataLevels.find((level) => level.id === id);
    if (geoLevel) {
      this.activeDataLevel = geoLevel;
    }
  }

  /** */
  setLocations(locations) {
    locations.forEach(l => {
      this.getTileData(l.layer, l.lonLat, null, true)
        .subscribe((data) => { this.addLocation(data); });
    });
  }

  /**
   * Sets the bounding box for the map to focus to
   * @param mapBounds an array with four coordinates representing south, west, north, east
   */
  setMapBounds(mapBounds) {
    this.mapView = mapBounds;
  }

  /**
   * Returns the URL parameters for the current view
   */
  getUrlParameters() {
    const paramMap = [ 'locations', 'year', 'geography', 'type', 'choropleth', 'bounds' ];
    return this.getRouteArray().reduce((a, b, i) => {
      return a + ';' + paramMap[i] + '=' + b;
    }, '');
  }

  /**
   * Gets an array of values that represent the current route
   */
  getRouteArray() {
    const locations = this.activeFeatures.map((f, i, arr) => {
      const lonLat = this.getFeatureLonLat(f).map(v => Math.round(v * 1000) / 1000);
      return f.properties['layerId'] + ',' + lonLat[0] + ',' + lonLat[1];
    }).join('+');
    return [
      (locations === '' ? 'none' : locations),
      this.activeYear,
      this.activeDataLevel.id,
      this.stripYearFromAttr(this.activeBubbleHighlight.id),
      this.stripYearFromAttr(this.activeDataHighlight.id),
      this.mapView ? this.mapView.join() : null
    ];
  }

  /**
   * Removes a location from the cards and data panel
   */
  removeLocation(feature) {
    const featuresCopy = this.activeFeatures.slice();
    const i = featuresCopy.findIndex((f) => _isEqual(f, feature));
    if (i > -1) {
      featuresCopy.splice(i, 1);
      this.activeFeatures = featuresCopy;
    }
  }

  /**
   * Adds a location to the cards and data panel
   * @param feature the feature for the corresponding location to add
   */
  addLocation(feature) {
    if (this.activeFeatures.length < 3) {
      const i = this.activeFeatures.findIndex((f) => {
        return f.properties.n === feature.properties.n &&
          f.properties.pl === feature.properties.pl;
      });
      if (!(i > -1)) {
        this.activeFeatures = [ ...this.activeFeatures, feature ];
      }
    }
  }

  /**
   * Gets a LonLat value for the center of the feature
   * @param feature
   */
  getFeatureLonLat(feature): Array<number> {
    const coords = feature.geometry['type'] === 'MultiPolygon' ?
    feature.geometry['coordinates'][0] : feature.geometry['coordinates'];
    return polylabel(coords, 1.0);
  }

  /**
   * Takes the layer to be queried and coordinates for an object,
   * determines which tile to request, parses it, and then returns
   * the first feature that the includes the coordinate point
   *
   * @param layerId ID of layer to query for tile data
   * @param lonLat array of [lon, lat]
   * @param featName feature name to check as fallback
   * @param multiYear specifies whether to merge multiple year tiles
   */
  getTileData(
    layerId: string, lonLat: number[], featName: string | null, multiYear = false
  ): Observable<MapFeature> {
    const coords = this.getXYFromLonLat(lonLat);
    const parseTile = this.getParser(layerId, lonLat, featName);
    if (multiYear) {
      const tileRequests = this.tilesetYears.map((y) => {
        return this.requestTile(layerId, coords, y).map(parseTile);
      });
      return Observable.forkJoin(tileRequests).map(this.mergeFeatureProperties.bind(this));
    } else {
      return this.requestTile(layerId, coords).map(parseTile);
    }
  }

  /**
   * Get the X/Y coords based on lonLat
   * @param lonLat
   */
  getXYFromLonLat(lonLat) {
    const xyzCoords = this.mercator.xyz(
      [lonLat[0], lonLat[1], lonLat[0], lonLat[1]], this.queryZoom
    );
    return { x: xyzCoords.maxX, y: xyzCoords.maxY };
  }

  /**
   * Gets the longitude and latitude from x, y, and z values.
   */
  getLonLatFromXYZ(x: number, y: number, z: number = this.queryZoom) {
    const bbox = this.mercator.bbox(x, y, z);
    return [ ((bbox[0] + bbox[2]) / 2), ((bbox[1] + bbox[3]) / 2) ];
  }

  private stripYearFromAttr(attr: string) {
    return attr.split('-')[0];
  }

  /**
   * Returns a function to parse the tile response from the tile HTTP request
   * @param layerId
   * @param lonLat
   */
  private getParser(layerId, lonLat, featName) {
    const point = this.getPoint(lonLat);
    const coords = this.getXYFromLonLat(lonLat);
    return (res: Response): MapFeature => {
      const tile = new vt.VectorTile(new Protobuf(res.arrayBuffer()));
      const layer = tile.layers[layerId];
      const features = [...Array(layer.length)].fill(null).map((d, i) => {
        return layer.feature(i).toGeoJSON(coords.x, coords.y, 10);
      });

      let matchFeat;
      const containsPoint = features.filter(feat => inside(point, feat));
      if (containsPoint.length) {
        matchFeat = containsPoint[0];
      } else {
        const matchesName = features.filter(feat =>
          feat.properties.n.toLowerCase().startsWith(featName.toLowerCase()));
        matchFeat = matchesName.length ? matchesName[0] : false;
      }

      if (matchFeat) {
        matchFeat.properties.layerId = layerId;
        matchFeat.properties.bbox = bbox(matchFeat);
        return matchFeat;
      }

      return {} as MapFeature;
    };
  }

  /**
   * Gets a GeoJSON feature for a point at the given `lonLat`
   * @param lonLat
   */
  private getPoint(lonLat): GeoJSON.Feature<GeoJSON.Point> {
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: lonLat },
      properties: {}
    } as GeoJSON.Feature<GeoJSON.Point>;
  }

  /**
   * Merges the properties in an array of features
   * @param features an array of features
   */
  private mergeFeatureProperties(features: any[]) {
    const feat = features[0];
    for (let i = 1; i < this.tilesetYears.length; ++i) {
      feat['properties'] = { ...feat['properties'], ...features[i]['properties']};
    }
    return feat as MapFeature;
  }

  /**
   * Requests a tile based on the provided layer, coordinates, and year
   * @param layerId
   * @param coords
   * @param year
   */
  private requestTile(layerId: string, coords: any, year = null) {
    const tilesetUrl = year ?
      this.tileBase + this.tilePrefix + layerId + '-' + year :
      this.tileBase + this.tilePrefix + layerId;
    return this.http.get(
      `${tilesetUrl}/${this.queryZoom}/${coords.x}/${coords.y}.pbf`,
      { responseType: ResponseContentType.ArrayBuffer }
    );
  }

}
