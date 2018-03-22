import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/observable/fromEvent';
import * as bbox from '@turf/bbox';
import * as union from '@turf/union';
import * as polylabel from 'polylabel';
import area from '@turf/area';
import { coordAll } from '@turf/meta';

import { MapLayerGroup } from '../data/map-layer-group';
import { MapFeature } from './map-feature';

@Injectable()
export class MapService {
  embedded = false;
  private map: mapboxgl.Map;
  private _isLoading = new BehaviorSubject<boolean>(true);
  private _zoom = new BehaviorSubject<number>(null);
  isLoading$ = this._isLoading.asObservable();
  zoom$ = this._zoom.asObservable();
  private colors = ['#e24000', '#434878', '#2c897f'];
  get mapCreated() { return this.map !== undefined; }

  constructor() { }

  /** Expose any MapboxGL API functions that are needed  */
  // https://www.mapbox.com/mapbox-gl-js/api/#map#setpaintproperty
  setLayerStyle(...args: any[]) { return this.map.setPaintProperty.apply(this.map, arguments); }
  // https://www.mapbox.com/mapbox-gl-js/api/#map#setfilter
  setLayerFilter(...args: any[]) { return this.map.setFilter.apply(this.map, arguments); }
  // https://www.mapbox.com/mapbox-gl-js/api/#map#setzoom
  setZoomLevel(...args: any[]) { return this.map.setZoom.apply(this.map, arguments); }
  enableZoom() { return (this.map ? this.map.scrollZoom.enable() : null); }
  disableZoom() { return (this.map ? this.map.scrollZoom.disable() : null); }

  /**
   * Create new Mapbox GL map from options object
   * @param options
   */
  createMap(options: Object) {
    const map = new mapboxgl.Map(options);
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    return map;
  }

  setLoading(state: boolean) {
    this._isLoading.next(state);
  }

  setZoomEvent(zoom: number) {
    this._zoom.next(zoom);
  }

  /**
   * Sets the map instance for the service to control
   * @param map mapbox instance
   */
  setMapInstance(map) { this.map = map; }

  /**
   * Set the visibility for a mapbox layer
   * @param layerId layer id of the mapbox layer
   * @param visible sets the layer visible if true, or hides if false
   */
  setLayerVisibility(layerId: string, visible: boolean) {
    const visibility = visible ? 'visible' : 'none';
    if (this.map.getLayer(layerId)) {
      this.map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  }

  /**
   * Set the visibility for a layer group
   * @param layerGroup the group of layers
   * @param visible sets the group visible if true, or hides if false
   */
  setLayerGroupVisibility(layerGroup: MapLayerGroup, visible: boolean) {
    layerGroup['layerIds'].forEach((layerId: string) => {
      this.setLayerVisibility(layerId, visible);
    });
  }

  /**
   * Update the layer styles of the layers within a group
   * @param layerGroup the layer group
   * @param styleProperty the paint style property to change (e.g. "fill-color")
   * @param newStyle the new property style (e.g. "#000000")
   */
  setLayerGroupStyle(layerGroup: MapLayerGroup, styleProperty: string, newStyle: any) {
    layerGroup['layerIds'].forEach((layerId) => {
      this.setLayerStyle(layerId, styleProperty, newStyle);
    });
  }

  /**
   * Update only the data property referenced in a map style
   * @param layerId
   * @param styleProperty
   * @param dataProperty
   */
  setLayerDataProperty(layerId: string, styleProperty: string, property: string) {
    const layerProperty = { ...this.map.getPaintProperty(layerId, styleProperty) };
    layerProperty['property'] = property;
    this.map.setPaintProperty(layerId, styleProperty, layerProperty);
  }

  /**
   * Updates the data property used in filters. Mostly used for updating null layers
   * @param layerId
   * @param property
   */
  setLayerFilterProperty(layerId: string, property: string) {
    const layerFilter = this.map.getFilter(layerId);
    layerFilter[1] = property;
    this.map.setFilter(layerId, layerFilter);
  }

  /**
   * Returns a boolean indicating if a layer has any features matching
   * the query
   *
   * @param layerId ID of vector tile layer to query
   * @param feature feature with attributes to query
   */
  hasRenderedFeatures(layerId: string, feature: MapFeature): boolean {
    return this.map.queryRenderedFeatures(undefined, {
      layers: [layerId],
      filter: [
        'all',
        ['==', 'n', feature.properties.n],
        ['==', 'pl', feature.properties.pl]
      ]
    }).length > 0;
  }

  /**
   * Query the map and return a union of features with a given GEOID
   * @param layerId
   * @param geoid
   */
  getQueryUnion(layerId: string, geoid: string): GeoJSON.Feature<GeoJSON.Polygon> | null {
    const queryFeatures = this.map.queryRenderedFeatures(undefined, {
      layers: [layerId],
      filter: ['==', 'GEOID', geoid]
    });
    if (queryFeatures.length > 0) {
      // Combine features, ignoring any TopologyExceptions
      try {
        return queryFeatures.reduce((currFeat, nextFeat) => {
          return union(
            currFeat as GeoJSON.Feature<GeoJSON.Polygon>,
            nextFeat as GeoJSON.Feature<GeoJSON.Polygon>
          );
        }) as GeoJSON.Feature<GeoJSON.Polygon>;
      } catch (e) { }
    }
    return null;
  }

  /**
   * Queries a layer for all features matching the name and parent-location of
   * a supplied feature, returns a GeoJSON feature combining the geographies of
   * all matching features. Used to consolidate GeoJSON features split by tiling
   *
   * @param layerId ID of vector tile layer to query
   * @param feature feature with attributes to query
   */
  getUnionFeature(layerId: string, feature: MapFeature): GeoJSON.Feature<GeoJSON.Polygon> | null {
    // Check if feature already has needed data first
    const geomBbox = bbox(feature);
    const featBbox = this.featureBbox(feature);
    const addReduce = (a, b) => a + b;
    if (
      this.bboxArea(geomBbox) >= (this.bboxArea(featBbox) * 0.98) &&
      geomBbox.reduce(addReduce, 0) !== featBbox.reduce(addReduce, 0)
    ) {
      return feature as GeoJSON.Feature<GeoJSON.Polygon>;
    }
    return this.getQueryUnion(layerId, feature.properties['GEOID'] as string);
  }

  /**
   * Gets the bounds of the current map view and returns an array
   */
  getBoundsArray() {
    return this.map.getBounds().toArray();
  }

  /**
   * Returns source data
   * @param sourceId ID of source to return
   */
  getSourceData(sourceId) {
    return (this.map.getSource(sourceId) as mapboxgl.GeoJSONSource)['_data']['features'];
  }

  /**
   * Set the data of a GeoJSON layer source, or empty the data if no
   * feature supplied
   * @param sourceId ID of GeoJSON source to modify
   * @param features Array of MapFeature objects
   */
  setSourceData(sourceId: string, features?: MapFeature[]) {
    (this.map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
      'type': 'FeatureCollection',
      'features': features ? features : []
    });
  }

  /**
   * Sets or updates highlight features
   * @param layerId String ID of current displayed map layer
   * @param features Array of active features to highlight
   * @param forceQuery whether a queryRenderedFeatures call should be required
   */
  updateHighlightFeatures(layerId: string, features: MapFeature[], forceQuery = false) {
    if (this.embedded) { return; }
    const highlightSource = this.getSourceData('highlight');
    const geoids = highlightSource.map(f => f['properties']['GEOID']);

    const highlightFeatures = features.map((f, i) => {
      let feat;
      // If feature is in active layer, update bounds
      // Otherwise, check if currently added or use bounding box
      if (
        f.properties['layerId'] === layerId &&
        this.hasRenderedFeatures(f.properties['layerId'] as string, f)
      ) {
        // Query features directly if forceQuery is true
        if (forceQuery) {
          feat = this.getQueryUnion(
            f.properties['layerId'] as string, f.properties['GEOID'] as string
          );
        } else {
          feat = this.getUnionFeature(f.properties['layerId'] as string, f);
        }
        const geoidFeatures = highlightSource.filter(
          sf => sf['properties']['GEOID'] === f['properties']['GEOID']
        );
        if (
          geoidFeatures.length > 0 &&
          feat !== null &&
          !this.shouldUpdateFeature(geoidFeatures[0], feat)
        ) {
          feat = geoidFeatures[0];
        }
      } else if (geoids.indexOf(f['properties']['GEOID']) !== -1) {
        feat = highlightSource.filter(
          sf => sf['properties']['GEOID'] === f['properties']['GEOID']
        )[0];
      } else {
        f.geometry['type'] = 'Polygon';
        f.geometry['coordinates'] = this.bboxPolygon(f.bbox);
        feat = f;
      }
      // Null check (later filtered out) null feature from getUnionFeature
      if (feat !== null) {
        feat['properties']['color'] = this.colors[i];
      }
      return feat;
    }).filter(f => f !== null);
    this.setSourceData('highlight', highlightFeatures);
  }

  /**
   * Takes an array of layer groups and a source suffix (last two characters of a census
   * layer year) and updates each of the layers in that group to to appropriate source.
   *
   * Ordinarily would try to generalize this, but updating the map style for each layer
   * or even layer group seems unnecessary.
   * @param layerGroups
   * @param sourceSuffix i.e. 00, 10
   */
  updateCensusSource(layerGroups: MapLayerGroup[], sourceSuffix: string) {
    const mapStyle: mapboxgl.Style = this.map.getStyle();
    const layerPrefixes = layerGroups.map(l => l.id);

    mapStyle.layers.map(l => {
      const layerPrefix = l.id.split('_')[0];
      if (layerPrefixes.indexOf(layerPrefix) > -1) {
        l.source = `us-${layerPrefix}-${sourceSuffix}`;
      }
      return l;
    });
    this.map.setStyle(mapStyle);
  }

  /**
   * Hides all layer groups that do not have a zoom range that falls within `zoom`
   * @param layerGroups an array of MapLayerGroup objects, with zoom properties
   * @param zoom the zoom level to hide based on
   * @return an array of MapLayerGroup objects that are currently visible
   */
  filterLayerGroupsByZoom(layerGroups: Array<MapLayerGroup>, zoom: number): Array<MapLayerGroup> {
    const visibleGroups = [];
    layerGroups.forEach((group) => {
      if (!group.zoom) { group.zoom = [-1, -1]; }
      const visible = (zoom >= group.zoom[0] && zoom < group.zoom[1]);
      this.setLayerGroupVisibility(group, visible);
      if (visible) { visibleGroups.push(group); }
    });
    return visibleGroups;
  }

  /**
   * Queries visible map layer, returns observable with distinct map features
   * @param layerGroup
   */
  queryMapLayer(layerGroup: MapLayerGroup) {
    return Observable.from(this.map.queryRenderedFeatures(undefined, {layers: [layerGroup.id]}))
      .distinct((f: MapFeature) => f.properties.n);
  }

  /**
   * Zoom to supplied map features
   * @param feature
   */
  zoomToFeature(feature: MapFeature) {
    const featBbox = feature.hasOwnProperty('bbox') ? feature['bbox'] : bbox(feature);
    this.zoomToBoundingBox(featBbox);
  }

  /**
   * Zoom to supplied point feature
   * @param feature Point feature
   * @param zoom Zoom level
   */
  zoomToPoint(feature: MapFeature, zoom = 14) {
    this.map.flyTo({ center: feature.geometry['coordinates'], zoom: zoom });
  }

  /**
   * Zoom to supplied bounding box
   * @param box An array of 4 numbers representing the bounding box
   */
  zoomToBoundingBox(box: Array<number>) {
    this.map.fitBounds([
      [box[0], box[1]],
      [box[2], box[3]]
    ], { padding: 50 });
  }

  private bboxArea(bbox: Array<number>): number {
    return Math.abs(bbox[0] - bbox[2]) * Math.abs(bbox[1] - bbox[3]);
  }

  private featureBbox(feature: MapFeature): Array<number> {
    return [
      +feature.properties['west'],
      +feature.properties['south'],
      +feature.properties['east'],
      +feature.properties['north']
    ];
  }

  /**
   * Based on @turf/bbox-polygon which isn't importing correctly
   * @param bbox Bounding box
   */
  private bboxPolygon(bbox: Array<number>): Array<Array<Array<number>>> {
    const west = bbox[0];
    const south = bbox[1];
    const east = bbox[2];
    const north = bbox[3];

    const lowLeft = [west, south];
    const topLeft = [west, north];
    const topRight = [east, north];
    const lowRight = [east, south];

    return [[
      lowLeft,
      lowRight,
      topRight,
      topLeft,
      lowLeft
    ]];
  }

  /**
   * Determines whether selected feature boundaries should update
   * @param currentFeat
   * @param newFeat
   */
  private shouldUpdateFeature(currentFeat, newFeat): boolean {
    // Check if the current feature has geometry
    if (!currentFeat.geometry && newFeat.geometry) { return true; }
    // Return false and exit early if the new feature has no geometry
    if (!newFeat.geometry) { return false; }

    const bboxPoly = {
      type: 'Polygon',
      coordinates: currentFeat.hasOwnProperty('bbox') ?
        this.bboxPolygon(currentFeat.bbox) : bbox(currentFeat)
    };
    // Update if current feature is a bounding box
    if (area(currentFeat) === area(bboxPoly)) { return true; }
    // Update if current feature has less than 95% of the new feature's area
    // Accounts for the fact that more detailed boundaries have slightly less area
    if (area(currentFeat) < (area(newFeat) * 0.95)) { return true; }
    // Update if the current feature has fewer coordinates than the new feature,
    // indicating that it's less detailed
    if (coordAll(currentFeat).length < coordAll(newFeat).length) { return true; }
    return false;
  }
}
