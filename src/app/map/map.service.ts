import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinct';
import * as bbox from '@turf/bbox';

import { MapLayerGroup } from './map-layer-group';
import { MapFeature } from './map-feature';

@Injectable()
export class MapService {
  map: mapboxgl.Map;

  constructor() { }

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
   * Update a style property for a layer
   * @param layerId id of the layer to change
   * @param styleProperty the paint style property to change (e.g. "fill-color")
   * @param newStyle the new property style (e.g. "#000000")
   */
  setLayerStyle(layerId: string, styleProperty: string, newStyle: any) {
    this.map.setPaintProperty(layerId, styleProperty, newStyle);
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

  setLayerFilter(layerId, filter) {
    this.map.setFilter(layerId, filter);
  }

  /**
   * Updates the map zoom level
   * @param newZoom new zoom value for map
   */
  setZoomLevel(newZoom: number) {
    this.map.zoomTo(+newZoom);
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
      .distinct((f: MapFeature) => f.properties.name);
  }

  /**
   * Zoom to supplied map features
   * @param feature
   */
  zoomToFeature(feature: any) {
    const featureBbox = bbox(feature);
    this.map.fitBounds([
      [featureBbox[0], featureBbox[1]],
      [featureBbox[2], featureBbox[3]]
    ]);
  }

  /**
   * Adds a popup on the map in the clicked area
   * TODO: make generic function for popups / tooltips
   * @param e The mapbox click event
   */
  addPopup(e) {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<h1>${e.features[0].properties.name}</h1>
          <ul>
            <li>Population: ${e.features[0].properties['population']} </li>
            <li>Average Household Size: ${e.features[0].properties['average-household-size']} </li>
            <li>Rented Households: ${e.features[0].properties['renting-occupied-households']} </li>
            <li>Poverty Rate: ${e.features[0].properties['poverty-rate']} </li>
            <li>Evictions: ${e.features[0].properties['evictions']} </li>
            <li>Eviction Rate: ${e.features[0].properties['eviction-rate']} </li>
          </ul>
        `)
        .addTo(this.map);
  }

}
