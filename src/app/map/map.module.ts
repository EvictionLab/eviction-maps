import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxComponent } from './mapbox/mapbox.component';
import { MapComponent } from './map/map.component';
import { MapUiModule } from '../map-ui/map-ui.module';


@NgModule({
  exports: [
    MapboxComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    MapUiModule
  ],
  declarations: [MapboxComponent, MapComponent]
})
export class MapModule { }
