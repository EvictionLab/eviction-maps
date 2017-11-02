import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { MapToolComponent } from './map-tool/map-tool.component';

const appRoutes: Routes = [
  { path: '', component: MapToolComponent }
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
