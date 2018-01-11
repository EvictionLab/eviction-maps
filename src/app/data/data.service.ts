import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
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
  dataLevels = DataLevels;
  dataAttributes = DataAttributes;
  bubbleAttributes = BubbleAttributes;
  languageOptions = [
    { id: 'en', name: '', langKey: 'HEADER.EN' },
    { id: 'es', name: '', langKey: 'HEADER.ES' }
  ];
  activeYear;
  activeFeatures: MapFeature[] = [];
  activeDataLevel: MapLayerGroup = DataLevels[0];
  activeDataHighlight: MapDataAttribute = DataAttributes[0];
  activeBubbleHighlight: MapDataAttribute = BubbleAttributes[0];
  autoSwitchLayers = true;
  mapView;
  mapConfig;

  get selectedLanguage() {
    return this.languageOptions.filter(l => l.id === this.translate.currentLang)[0];
  }
  // For tracking "soft" location updates
  private _locations = new BehaviorSubject<MapFeature[]>([]);
  locations$ = this._locations.asObservable();

  private mercator = new SphericalMercator({ size: 256 });
  private tileBase = 'https://tiles.evictionlab.org/';
  private tilePrefix = 'evictions-';
  private tilesetYears = ['00', '10'];
  private queryZoom = 10;

  constructor(private http: HttpClient, private translate: TranslateService) {
    translate.onLangChange.subscribe((lang) => {
      this.updateLanguage(lang.translations);
    });
  }


  updateLanguage(translations) {
    if (translations.hasOwnProperty('HEADER')) {
      const header = translations['HEADER'];
      this.languageOptions = this.languageOptions.map(l => {
        if (l.langKey) { l.name = header[ l.langKey.split('.')[1] ]; }
        return l;
      });
    }
    // translate census attribute names
    if (translations.hasOwnProperty('STATS')) {
      const stats = translations['STATS'];
      this.dataAttributes = DataAttributes.map((a) => {
        if (a.langKey) { a.name = stats[ a.langKey.split('.')[1] ]; }
        return a;
      });
      this.bubbleAttributes = BubbleAttributes.map((a) => {
        if (a.langKey) { a.name = stats[ a.langKey.split('.')[1] ]; }
        return a;
      });
    }
    // translate geography layers
    if (translations.hasOwnProperty('LAYERS')) {
      const layers = translations['LAYERS'];
      this.dataLevels = DataLevels.map((l) => {
        if (l.langKey) { l.name = layers[ l.langKey.split('.')[1] ]; }
        return l;
      });
    }
  }

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
   * @param mapBounds an array with four coordinates representing west, south, east, north
   */
  setMapBounds(mapBounds) {
    this.mapView = mapBounds;
  }

  /**
   * Returns the URL parameters for the current view
   */
  getUrlParameters() {
    const paramMap = [ 'year', 'geography', 'bounds' ];
    return this.getRouteArray().reduce((a, b, i) => {
      return a + ';' + paramMap[i] + '=' + b;
    }, '');
  }

  /**
   * Returns query parameters
   */
  getQueryParameters() {
    const locations = this.activeFeatures.map((f, i, arr) => {
      const lonLat = this.getFeatureLonLat(f).map(v => Math.round(v * 1000) / 1000);
      return f.properties['layerId'] + ',' + lonLat[0] + ',' + lonLat[1];
    }).join('+');

    return {
      lang: this.translate.currentLang,
      type: this.stripYearFromAttr(this.activeBubbleHighlight.id),
      choropleth: this.stripYearFromAttr(this.activeDataHighlight.id),
      locations: locations
    };
  }

  /**
   * Gets an array of values that represent the current route
   */
  getRouteArray() {
    return [
      this.activeYear,
      this.activeDataLevel.id,
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
   * Adds or updates a location to the cards and data panel
   * @param feature the feature for the corresponding location to add
   * @returns feature if one is removed to make room for the new one, null if not
   */
  addLocation(feature): MapFeature {
    // Process feature if bbox and layerId not included based on current data level
    if (!(feature.properties.bbox && feature.properties.bbox)) {
      feature = this.processMapFeature(feature);
    }
    const removedLocation =
      (this.activeFeatures.length < 3) ? null : this.activeFeatures.shift();
    this.activeFeatures = [...this.activeFeatures, feature];
    this._locations.next(this.activeFeatures);
    return removedLocation;
  }

  /**
   * Updates an active feature with updated geometry and properties
   * @param feature the active feature to update
   */
  updateLocation(feature: MapFeature) {
    // Process feature if bbox and layerId not included based on current data level
    if (!(feature.properties.bbox && feature.properties.bbox)) {
      feature = this.processMapFeature(feature);
    }
    const geoids = this.activeFeatures.map(f => f.properties.GEOID);
    const featIndex = geoids.indexOf(feature.properties.GEOID);
    if (featIndex !== -1) {
      // Assigning properties and geometry rather than the whole feature
      // so that a state change isn't triggered
      this.activeFeatures[featIndex].properties = feature.properties;
      this.activeFeatures[featIndex].geometry = feature.geometry;
      this._locations.next(this.activeFeatures);
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
    feature.bbox = [
      +feature.properties['west'],
      +feature.properties['south'],
      +feature.properties['east'],
      +feature.properties['north']
    ];
    return feature;
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
    return (res: ArrayBuffer): MapFeature => {
      const tile = new vt.VectorTile(new Protobuf(res));
      const layer = tile.layers[layerId];
      const features = [...Array(layer.length)].fill(null).map((d, i) => {
        return layer.feature(i).toGeoJSON(coords.x, coords.y, 10);
      });

      let matchFeat;
      const containsPoint = features.filter(feat => inside(point, feat));
      if (containsPoint.length) {
        matchFeat = containsPoint[0];
      } else {
        // Check if featName is non-null, filter featurues by it if exists
        const matchesName = featName ? features.filter(feat =>
          feat.properties.n.toLowerCase().startsWith(featName.toLowerCase())) : features;
        matchFeat = matchesName.length ? matchesName[0] : false;
      }

      if (matchFeat) {
        return this.processMapFeature(matchFeat, layerId);
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
      { responseType: 'arraybuffer' }
    );
  }

}
