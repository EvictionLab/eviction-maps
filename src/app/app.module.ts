import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { MapUiModule } from './map-ui/map-ui.module';
import { DataPanelModule } from './data-panel/data-panel.module';
import { PlatformService } from './platform.service';
import { SearchService } from './search/search.service';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    HttpModule,
    MapUiModule,
    DataPanelModule,
    BrowserModule,
    MapModule
  ],
  providers: [ PlatformService, SearchService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
