import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapBoxModule } from 'angular-mapbox/module';
import { MapboxComponent } from './mapbox/mapbox.component';


@NgModule({
  exports: [
    MapboxComponent
  ],
  imports: [
    CommonModule,
    MapBoxModule.forRoot(''),
  ],
  declarations: [MapboxComponent]
})
export class MapModule { }
