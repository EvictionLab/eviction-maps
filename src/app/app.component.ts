import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { MapDataAttribute } from './map/map-data-attribute';
import { MapLayerGroup } from './map/map-layer-group';
import { MapDataObject } from './map/map-data-object';
import { MapFeature } from './map/map-feature';
import { MapboxComponent } from './map/mapbox/mapbox.component';
import { MapService } from './map/map.service';
import { DataLevels } from './data/data-levels';
import { DataAttributes } from './data/data-attributes';
import { PlatformService } from './platform.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ MapService ]
})
export class AppComponent {
  title = 'Eviction Lab';
  zoom: number;
  censusYear = 2010;
  dataYear = 2015;
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
    'states-2010',
    'cities-2010',
    'tracts-2010',
    'blockgroups-2010',
    'zipcodes-2010',
    'counties-2010'
  ];
  private hover_HACK = 0; // used to ignore first hover event when on touch, temp hack

  constructor(
    private map: MapService,
    public platform: PlatformService,
    private _sanitizer: DomSanitizer
  ) {}

  /**
   * Update the legend to correspond to the fill stops on the active data highlight
   */
  updateLegend() {
    if (!this.activeDataLevel || !this.activeDataHighlight) {
      this.legend = null;
      return;
    }
    this.legend = this.activeDataHighlight.opacityStops[this.activeDataLevel.id] ||
      this.activeDataHighlight.opacityStops['default'];
  }

  /**
   * Set the map instance, the data level, highlight layer, current year, and zoom
   * handler when the map is ready
   * @param map mapbox instance
   */
  onMapReady(map) {
    this.map.setMapInstance(map);
    this.activeDataLevel = this.dataLevels[4];
    this.activeDataHighlight = this.attributes[0];
    this.setDataYear(this.dataYear);
    this.onMapZoom(this.mapConfig.zoom);
    this.autoSwitchLayers = true;
    this.map.setupHoverPopup();
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

  /**
   * Activates a feature if it is currently in a "hovered" state
   * If the feature is not yet in a "hovered" state, set the feature
   * as hovered.
   * @param feature the map feature
   */
  onFeatureClick(feature) {
    if (
      this.hoveredFeature &&
      this.hoveredFeature.properties.name === feature.properties.name &&
      this.hoveredFeature.properties['parent-location'] === feature.properties['parent-location']
    ) {
      // user has hovered the feature, jump to the more data on click
      this.activeFeature = feature;
      this.hoveredFeature = null;
    } else {
      // no hover, probably a touch device, show preview first
      this.onFeatureHover(feature);
    }
  }

  /**
   * Sets the tooltip and highlighted shape on the map
   * TODO: prevent this function from firing immediately before onFeatureClick
   * when touching a location, and remove hover_HACK that absorbs the first hover on mobile
   * @param feature the feature being hovered (or null if no longer hovering)
   */
  onFeatureHover(feature) {
    if (this.hover_HACK > 0 || !this.platform.isMobile()) {
      this.hover_HACK = 0;
      this.hoveredFeature = feature;
      const hoverLayer =
        this.activeDataLevel.layerIds[this.activeDataLevel.layerIds.length - 1];
      if (this.hoveredFeature) {
        this.map.setLayerFilter(
          hoverLayer, [
            'all',
            ['==', 'name', this.hoveredFeature.properties.name],
            ['==', 'parent-location', this.hoveredFeature.properties['parent-location']]
          ]
        );
      } else {
        this.map.setLayerFilter(hoverLayer, ['==', 'name', '']);
      }
    } else if (this.hover_HACK === 0 && feature) {
      this.hover_HACK = 1;
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
    layerGroup = this.addYearToObject(layerGroup, this.censusYear);
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
    this.activeDataHighlight = this.addYearToObject(attr, this.dataYear);
    this.updateLegend();
    this.mapEventLayers.forEach((layerId) => {
      const newOpacity = {
        'property': attr.id,
        'stops': (attr.opacityStops[layerId] ?
          attr.opacityStops[layerId] : attr.opacityStops['default'])
      };
      this.map.setLayerStyle(layerId, 'fill-opacity', newOpacity);
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

  /**
   * Add year to data attribute or level from selector
   * @param dataObject
   * @param year
   */
  addYearToObject(dataObject: MapDataObject, year: number) {
    if (/.*\d{4}.*/g.test(dataObject.id)) {
      dataObject.id = dataObject.id.replace(/\d{4}/g, year + '');
    } else {
      dataObject.id += '-' + year;
    }
    return dataObject;
  }

  /**
   * Sets the data year for the map, updates data highlights and layers
   * @param year
   */
  setDataYear(year: number) {
    console.log('setting year', year);
    this.dataYear = year;
    this.censusYear = this.getCensusYear(year);
    this.setDataHighlight(this.addYearToObject(this.activeDataHighlight, this.dataYear));
    this.setGroupVisibility(this.addYearToObject(this.activeDataLevel, this.censusYear));
    this.updateLegend();
  }

  /**
   * Returns the nearest census year for a given year
   * @param year
   */
  getCensusYear(year: number) {
    return Math.floor(year / 10) * 10;
  }

  /**
   * Returns sanitized gradient for the legend
   */
  getLegendGradient() {
    return this._sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(to right, rgba(241,128,67,${this.legend[0][1]}), ` +
      `rgba(241,128,67,${this.legend[this.legend.length - 1][1]}))`
    );
  }
}
