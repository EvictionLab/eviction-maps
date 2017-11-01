import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphModule } from 'angular-d3-graph/module';
import { MapUiModule } from '../map-ui/map-ui.module';

import { DataPanelComponent } from './data-panel.component';
import { LocationCardsComponent } from '../location-cards/location-cards.component';
import { DownloadFormComponent } from './download-form/download-form.component';

@NgModule({
  exports: [ DataPanelComponent, LocationCardsComponent ],
  imports: [
    CommonModule,
    FormsModule,
    MapUiModule,
    GraphModule.forRoot()
  ],
  declarations: [ DataPanelComponent, LocationCardsComponent, DownloadFormComponent ],
  entryComponents: [ DataPanelComponent, LocationCardsComponent, DownloadFormComponent ]
})
export class DataPanelModule { }
