import { Component, ViewChild, OnInit } from '@angular/core';

import { MapLayer } from './map-ui/map-layer';
import { MapComponent } from './map/map.component';
import { DataLevels } from './data/data-levels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Eviction Lab';
  dataLevels: Array<MapLayer> = DataLevels;
  attributes: Array<any> = [
    { 'id': 'poverty-rate', 'name': 'Poverty Rate' },
    { 'id': 'population', 'name': 'Population' }
  ];
  @ViewChild(MapComponent) map: MapComponent;

  /**
   * Set the default layer group on init
   */
  ngOnInit() {
    this.map.ready.subscribe((map) => {
      console.log(map);
      this.setGroupVisibility(this.dataLevels[0]);
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
    const newFill = {
      'property': attr.id,
      'stops': [
        [0, 'blue'],
        [100, 'red']
      ]
    };
    // this.map.updateLayerStyles();
  }

}
