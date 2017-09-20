import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxComponent } from './mapbox/mapbox.component';


@NgModule({
  exports: [
    MapboxComponent
  ],
  imports: [
    CommonModule
  ],
  declarations: [MapboxComponent]
})
export class MapModule { }
