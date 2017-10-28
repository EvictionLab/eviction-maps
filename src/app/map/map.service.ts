import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinct';
import * as bbox from '@turf/bbox';
import * as union from '@turf/union';

import { MapLayerGroup } from './map-layer-group';
import { MapFeature } from './map-feature';

@Injectable()
export class MapService {
  private map: mapboxgl.Map;
  private popup: mapboxgl.Popup;
  private _isLoading = new BehaviorSubject<boolean>(true);
  isLoading$ = this._isLoading.asObservable();

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

  /**
   * Sets the map instance for the service to control
   * @param map mapbox instance
   */
  setMapInstance(map) { this.map = map; }

  /**
   * Setup hover popup to display when labels are not visible
   * @param layerIds layer IDs to query for tooltip label
   */
  setupHoverPopup(layerIds: string[]) {
    this.popup = new mapboxgl.Popup({ closeButton: false });
    this.map.on('mousemove', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, { layers: layerIds });
      if (features.length) {
        const feat: MapFeature = features[0];
        // Check if labels are visible, don't display tooltip if so
        const labelLayer = this.map.getLayer(`${feat['layer']['id']}_text`);
        const labelFeatures = this.map.queryRenderedFeatures(undefined, {
          layers: [`${feat['layer']['id']}_text`],
          filter: [
            'all',
            ['==', 'n', feat.properties.n],
          ]
        });
        if (labelFeatures.length && labelLayer.paint['text-opacity'] > 0) {
          this.popup.remove();
        } else {
          this.popup.setLngLat(e.lngLat)
            .setHTML(`${feat.properties.n}, ${feat.properties.pl}`)
            .addTo(this.map);
        }
      } else {
        this.popup.remove();
      }
    });
    this.map.on('mouseout', (e) => {
      this.popup.remove();
    });
  }

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
   * Queries a layer for all features matching the name and parent-location of
   * a supplied feature, returns a GeoJSON feature combining the geographies of
   * all matching features. Used to consolidate GeoJSON features split by tiling
   *
   * @param layerId ID of vector tile layer to query
   * @param feature feature with attributes to query
   */
  getUnionFeature(layerId: string, feature: MapFeature): GeoJSON.Feature<GeoJSON.Polygon> {
    return this.map.queryRenderedFeatures(undefined, {
      layers: [layerId],
      filter: [
        'all',
        ['==', 'n', feature.properties.n],
        ['==', 'pl', feature.properties.pl]
      ]
    }).reduce((currFeat, nextFeat) => {
      return union(
        currFeat as GeoJSON.Feature<GeoJSON.Polygon>,
        nextFeat as GeoJSON.Feature<GeoJSON.Polygon>
      );
    }, feature) as GeoJSON.Feature<GeoJSON.Polygon>;
  }

  /**
   * Gets the bounds of the current map view and returns an array
   */
  getBoundsArray() {
    return this.map.getBounds().toArray();
  }

  /**
   * Set the data of a GeoJSON layer source, or empty the data if no
   * feature supplied
   * @param sourceId ID of GeoJSON source to modify
   * @param feature MapFeature object
   */
  setSourceData(sourceId: string, feature?: MapFeature) {
    const features = feature ? [feature] : [];
    (this.map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
      'type': 'FeatureCollection',
      'features': features
    });
  }

  /**
   * Takes an array of layer groups and a source suffix (last two characters of a census
   * layer year) and updates each of the layers in that group to to appropriate source.
   *
   * Ordinarily would try to generalize this, but updating the map style for each layer
   * or even layer group seems unnecessary.
   * @param layerGroups
   * @param sourceSuffix i.e. 90, 00, 10
   */
  updateCensusSource(layerGroups: MapLayerGroup[], sourceSuffix: string) {
    const mapStyle: mapboxgl.Style = this.map.getStyle();
    const layerObj = {};
    layerGroups.forEach(l => {
      layerObj[l.id] = l.layerIds;
    });

    mapStyle.layers.map(l => {
      const layerPrefix = l.id.split('_')[0];
      if (layerObj.hasOwnProperty(layerPrefix)) {
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
  zoomToFeature(feature: any) {
    const featureBbox = bbox(feature);
    this.zoomToBoundingBox(featureBbox);
  }

  /**
   * Zoom to supplied point feature
   * @param feature Point feature
   */
  zoomToPoint(feature: MapFeature) {
    this.map.flyTo({ center: feature.geometry['coordinates'], zoom: 12 });
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
}
