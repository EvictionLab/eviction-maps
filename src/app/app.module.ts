import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { MapUiModule } from './map-ui/map-ui.module';
import { DataPanelModule } from './data-panel/data-panel.module';
import { PlatformService } from './platform.service';
import { SearchService } from './search/search.service';
import { StackedBarsComponent } from './stacked-bars/stacked-bars.component';

@NgModule({
  declarations: [ AppComponent, StackedBarsComponent ],
  imports: [
    HttpModule,
    MapUiModule,
    DataPanelModule,
    BrowserModule,
    MapModule,
    Ng2PageScrollModule
  ],
  providers: [ PlatformService, SearchService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
