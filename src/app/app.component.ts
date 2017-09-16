import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MapDataAttribute } from './map/map-data-attribute';
import { MapLayerGroup } from './map/map-layer-group';
import { MapFeature } from './map/map-feature';
import { MapboxComponent } from './map/mapbox/mapbox.component';
import { MapService } from './map/map.service';
import { DataLevels } from './data/data-levels';
import { DataAttributes } from './data/data-attributes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ MapService ]
})
export class AppComponent implements OnInit {
  title = 'Eviction Lab';
  zoom: number;
  dataLevels: Array<MapLayerGroup> = DataLevels;
  attributes: Array<MapDataAttribute> = DataAttributes;
  hoveredFeature;
  activeFeature;
  mapFeatures: Observable<Object>;
  activeDataLevel: MapLayerGroup;
  activeDataHighlight: MapDataAttribute;
  autoSwitchLayers = true;
  mapConfig = {
    style: './assets/style.json',
    center: [-77.99, 41.041480],
    zoom: 6.5,
    minZoom: 3,
    maxZoom: 14,
    container: 'map'
  };
  legend;
  mapEventLayers: Array<string> = [
    'states', 'cities', 'tracts', 'blockgroups', 'zipcodes', 'counties'
  ];

  constructor(private map: MapService) {}

  ngOnInit() {}

  updateLegend() {
    if (!this.activeDataLevel || !this.activeDataHighlight) {
      this.legend = null;
      return;
    }
    this.legend = this.activeDataHighlight.fillStops[this.activeDataLevel.id] ||
      this.activeDataHighlight.fillStops['default'];
  }

  onMapReady(map) {
    this.map.setMapInstance(map);
    // this.setGroupVisibility(this.dataLevels[0]);
    this.setDataHighlight(this.attributes[0]);
    this.onMapZoom(this.mapConfig.zoom);
  }

  /**
   * Set the zoom value for the app, auto adjust layers if enabled
   * @param zoom the current zoom level of the map
   */
  onMapZoom(zoom) {
    this.zoom = zoom;
    if (this.autoSwitchLayers) {
      const visibleGroups = this.map.filterLayerGroupsByZoom(this.dataLevels, zoom);
      if (visibleGroups.length > 0) {
        this.activeDataLevel = visibleGroups[0];
        this.mapFeatures = this.map.queryMapLayer(this.activeDataLevel);
        this.updateLegend();
      }
    }
  }

  /**
   * Updates mapFeatures on map render
   * @param event
   */
  onMapRender(event) {
    if (this.activeDataLevel) {
      this.mapFeatures = this.map.queryMapLayer(this.activeDataLevel);
    }
  }

  onFeatureClick(feature) {
    // console.log('feature click:', feature);
    if (this.hoveredFeature) {
      // user has hovered the feature, jump to the more data on click
      console.log('feature click', feature);
      this.activeFeature = feature;
      this.hoveredFeature = null;
    } else {
      // no hover, probably a touch device, show preview first
      this.onFeatureHover(feature);
    }
  }

  onFeatureHover(feature) {
    console.log('feature hover', feature);
    this.hoveredFeature = feature;
    if (this.hoveredFeature) {
      this.map.setLayerFilter(
        this.activeDataLevel.id + '_hover', [
          'all',
          ['==', 'name', this.hoveredFeature.properties.name],
          ['==', 'parent-location', this.hoveredFeature.properties['parent-location']]
        ]
      );
    } else {
      this.map.setLayerFilter(this.activeDataLevel.id + '_hover', ['==', 'name', '']);
    }
  }

  /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   */
  onSearchSelect(feature: MapFeature) {
    this.autoSwitchLayers = false;
    this.map.zoomToFeature(feature);
    this.activeFeature = feature;
    this.hoveredFeature = null;
  }

  /**
   * Sets the visibility on a layer group
   * @param mapLayer the layer group that was selected
   */
  setGroupVisibility(layerGroup: MapLayerGroup) {
    this.autoSwitchLayers = false;
    this.dataLevels.forEach((group: MapLayerGroup) => {
      this.map.setLayerGroupVisibility(group, (group.id === layerGroup.id));
    });
    this.activeDataLevel = layerGroup;
  }

  /**
   * Sets the highlights (choropleths) to a different data property available in the tile data.
   * @param attr the map data attribute to set highlights for
   */
  setDataHighlight(attr: MapDataAttribute) {
    this.activeDataHighlight = attr;
    this.updateLegend();
    this.mapEventLayers.forEach((layerId) => {
      const newFill = {
        'property': attr.id,
        'stops': (attr.fillStops[layerId] ? attr.fillStops[layerId] : attr.fillStops['default'])
      };
      this.map.setLayerStyle(layerId, 'fill-color', newFill);
    });
  }

  /**
   * Sets the zoom level across both the map and zoom control components
   * @param zoomLevel new zoom level
   */
  setMapZoomLevel(zoomLevel: number) {
    this.zoom = +zoomLevel;
    this.map.setZoomLevel(zoomLevel);
  }

}
