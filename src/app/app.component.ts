import { Component, ViewChild } from '@angular/core';

import { MapLayer } from './map-ui/map-layer';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  dataLevels: Array<any> = [
    {
      id: 'blockgroups',
      name: 'Block Groups',
      layerIds: [ 'blockgroups', 'blockgroups_stroke', 'blockgroups_text' ]
    },
    { id: 'zipcodes', name: 'Zip Codes', layerIds: [] },
    {
      id: 'tracts',
      name: 'Tracts',
      layerIds: [ 'tracts', 'tracts_stroke', 'tracts_text' ]
    },
    {
      id: 'cities',
      name: ' Cities',
      layerIds: [ 'cities', 'cities_stroke', 'cities_text' ]
    },
    {
      id: 'counties',
      name: 'Counties',
      layerIds: [ 'counties', 'counties_stroke', 'counties_text' ]
    },
    {
      id: 'states',
      name: 'States',
      layerIds: [ 'states', 'states_stroke', 'states_text' ]
    }
  ];
  @ViewChild(MapComponent) map: MapComponent;

  onLayerChange(mapLayer: MapLayer) {
    this.dataLevels.forEach((layer: MapLayer) => {
      this.map.setLayerGroupVisibility(layer, (layer.id === mapLayer.id));
    });
  }

}
