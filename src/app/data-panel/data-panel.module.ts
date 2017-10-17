import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphModule } from 'angular-d3-graph/module';
import { MapUiModule } from '../map-ui/map-ui.module';

import { DataPanelComponent } from './data-panel.component';

@NgModule({
  exports: [ DataPanelComponent ],
  imports: [
    CommonModule,
    MapUiModule,
    GraphModule.forRoot()
  ],
  declarations: [ DataPanelComponent ],
  entryComponents: [ DataPanelComponent ]
})
export class DataPanelModule { }
