import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { MapToolComponent } from './map-tool/map-tool.component';

const defaultData = {
  mapConfig: {
    style: './assets/style.json',
    center: [-98.5556199, 39.8097343],
    zoom: 3,
    minZoom: 3,
    maxZoom: 14
  },
  year: 2015,
  locations: 'none',
  geography: 'states',
  types: 'none',
  choropleth: 'none'
};

const appRoutes: Routes = [
  {
    path: ':locations/:year/:geography/:type/:choropleth/:bounds',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: ':locations/:year/:geography/:type/:choropleth',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: ':locations/:year/:geography/:type/:choropleth',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: ':locations/:year/:geography/:type',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: ':locations/:year/:geography',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: ':locations/:year',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: ':locations',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: 'link',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: 'map',
    component: MapToolComponent,
    data: defaultData
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
