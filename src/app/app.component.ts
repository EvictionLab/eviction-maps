import { Component, ViewChild, OnInit } from '@angular/core';

import { MapLayer } from './map-ui/map-layer';
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
  dataLevels: Array<MapLayer> = DataLevels;
  attributes: Array<any> = DataAttributes;
  @ViewChild(MapComponent) map: MapComponent;

  /**
   * Set the default layer group on init
   */
  ngOnInit() {
    this.map.ready.subscribe((map) => {
      this.setGroupVisibility(this.dataLevels[0]);
      this.setDataHighlight(this.attributes[0]);
    });
  }

  /**
   * Sets the visibility on a layer group
   * @param mapLayer the layer group that was selected
   */
  setGroupVisibility(layerGroup: MapLayer) {
    this.dataLevels.forEach((group: MapLayer) => {
      this.map.setLayerGroupVisibility(group, (group.id === layerGroup.id));
    });
  }

  setDataHighlight(attr: any) {
    const fillLayers = {
      id: 'fills',
      name: 'fills',
      layerIds: [ 'states', 'cities', 'tracts', 'blockgroups', 'zipcodes', 'counties']
    };

    fillLayers.layerIds.forEach((layerId) => {
      const newFill = {
        'property': attr.id,
        'stops': (attr.stops[layerId] ? attr.stops[layerId] : attr.stops['default'])
      };
      this.map.setLayerStyle(layerId, 'fill-color', newFill);
    });
  }

}
