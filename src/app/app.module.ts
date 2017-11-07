import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { MapToolComponent } from './map-tool/map-tool.component';

const mapConfig = {
  style: './assets/style.json',
  center: [-98.5556199, 39.8097343],
  zoom: 3,
  minZoom: 3,
  maxZoom: 14
};

const appRoutes: Routes = [
  {
    path: ':geography/:year/:type/:choropleth/:locations',
    component: MapToolComponent,
    data: { mapConfig: mapConfig }
  },
  {
    path: ':geography/:year/:type/:choropleth',
    component: MapToolComponent,
    data: { mapConfig: mapConfig }
  },
  {
    path: ':geography/:year/:type',
    component: MapToolComponent,
    data: { mapConfig: mapConfig }
  },
  {
    path: ':geography/:year',
    component: MapToolComponent,
    data: { mapConfig: mapConfig }
  },
  {
    path: ':geography',
    component: MapToolComponent,
    data: { mapConfig: mapConfig }
  },
  {
    path: 'map',
    component: MapToolComponent,
    data: { mapConfig: mapConfig, year: 2015 }
  },
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    UiModule,
    MapToolModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
