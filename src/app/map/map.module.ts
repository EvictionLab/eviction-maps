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
    MapBoxModule.forRoot(
      'pk.eyJ1IjoiZXZpY3Rpb25sYWIiLCJhIjoiY2o2Z3NsMG85MDF6dzMybW15cWswMGJwNCJ9' +
      '.PW6rLbRiQdme0py5f8IstA'
    ),
  ],
  declarations: [MapboxComponent]
})
export class MapModule { }
