import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphModule } from 'angular-d3-graph/module';
import { MapUiModule } from '../map-ui/map-ui.module';

import { DataPanelComponent } from './data-panel.component';
import { LocationCardsComponent } from '../location-cards/location-cards.component';
import { StackedBarsComponent } from '../stacked-bars/stacked-bars.component';

@NgModule({
  exports: [ DataPanelComponent, LocationCardsComponent, StackedBarsComponent ],
  imports: [
    CommonModule,
    MapUiModule,
    GraphModule.forRoot()
  ],
  declarations: [ DataPanelComponent, LocationCardsComponent, StackedBarsComponent ],
  entryComponents: [ DataPanelComponent, LocationCardsComponent, StackedBarsComponent ]
})
export class DataPanelModule { }
