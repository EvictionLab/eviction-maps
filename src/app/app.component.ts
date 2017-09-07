import { Component, ViewChild, OnInit } from '@angular/core';

import { MapDataAttribute } from './map-ui/map-data-attribute';
import { MapLayerGroup } from './map-ui/map-layer-group';
import { MapComponent } from './map/map.component';
import { DataLevels } from './data/data-levels';
import { DataAttributes } from './data/data-attributes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Eviction Lab';
  zoom: number;
  minZoom: number;
  maxZoom: number;
  dataLevels: Array<MapLayerGroup> = DataLevels;
  attributes: Array<MapDataAttribute> = DataAttributes;
  @ViewChild(MapComponent) map: MapComponent;

  /**
   * Set the default layer group on init
   */
  ngOnInit() {
    this.map.ready.subscribe((map) => {
      this.setGroupVisibility(this.dataLevels[0]);
      this.setDataHighlight(this.attributes[0]);
      this.zoom = map.getZoom();
      this.minZoom = map.getMinZoom();
      this.maxZoom = map.getMaxZoom();
    });
    this.map.zoom.subscribe((zoom) => { this.zoom = zoom; });
  }

  /**
   * Sets the visibility on a layer group
   * @param mapLayer the layer group that was selected
   */
  setGroupVisibility(layerGroup: MapLayerGroup) {
    this.dataLevels.forEach((group: MapLayerGroup) => {
      this.map.setLayerGroupVisibility(group, (group.id === layerGroup.id));
    });
  }

  /**
   * Sets the highlights (choropleths) to a different data property available in the tile data.
   * @param attr the map data attribute to set highlights for
   */
  setDataHighlight(attr: MapDataAttribute) {
    const layerIds = [ 'states', 'cities', 'tracts', 'blockgroups', 'zipcodes', 'counties'];
    layerIds.forEach((layerId) => {
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
