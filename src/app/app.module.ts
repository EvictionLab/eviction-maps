import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MapBoxModule } from 'angular-mapbox/module';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    MapBoxModule.forRoot("pk.eyJ1IjoiZXZpY3Rpb25sYWIiLCJhIjoiY2o2Z3NsMG85MDF6dzMybW15cWswMGJwNCJ9.PW6rLbRiQdme0py5f8IstA")
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
