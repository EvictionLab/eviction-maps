import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Ng2PageScrollModule} from 'ng2-page-scroll';

import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { MapUiModule } from './map-ui/map-ui.module';
import { DataPanelModule } from './data-panel/data-panel.module';
import { PlatformService } from './platform.service';
import { LocationCardsComponent } from './location-cards/location-cards.component';

@NgModule({
  declarations: [ AppComponent, LocationCardsComponent ],
  imports: [
    MapUiModule,
    DataPanelModule,
    BrowserModule,
    MapModule,
    Ng2PageScrollModule
  ],
  providers: [ PlatformService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
