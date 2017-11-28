import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { MapToolComponent } from './map-tool/map-tool.component';
import { PlatformService } from './platform.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const defaultData = {
  mapConfig: {
    style: './assets/style.json',
    center: [-98.5795, 39.8283],
    zoom: 3,
    minZoom: 3,
    maxZoom: 14
  },
  year: 2016
};

const appRoutes: Routes = [
  {
    path: ':locations/:year/:geography/:type/:choropleth/:bounds',
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: 'link', // optional path for URL parameters
    component: MapToolComponent,
    data: defaultData
  },
  {
    path: '',
    redirectTo: '/none/2016/auto/none/none/-136.80,20.68,-57.60,52.06', // default view
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    UiModule,
    MapToolModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
    )
  ],
  providers: [ PlatformService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
