import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MapBoxModule } from 'angular-mapbox/module';

import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { MapUiModule } from './map-ui/map-ui.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    MapUiModule,
    BrowserModule,
    MapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
