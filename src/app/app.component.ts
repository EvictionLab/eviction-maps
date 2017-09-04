import { Component } from '@angular/core';

import { MapLayer } from './map-ui/map-layer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  dataLevels: Array<MapLayer> = [
    { id: 'blockgroups', name: 'Block Groups' },
    { id: 'zipcodes', name: 'Zip Codes' },
    { id: 'tracts', name: 'Tracts' },
    { id: 'cities', name: ' Cities' },
    { id: 'counties', name: 'Counties'},
    { id: 'states', name: 'States' }
  ];
}
