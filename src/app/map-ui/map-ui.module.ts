import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { LayerSelectComponent } from './layer-select/layer-select.component';
import { HighlightSelectorComponent } from './highlight-selector/highlight-selector.component';
import { ZoomControlComponent } from './zoom-control/zoom-control.component';
import { MapTooltipComponent } from './map-tooltip/map-tooltip.component';

@NgModule({
  exports: [
    LayerSelectComponent,
    HighlightSelectorComponent,
    ZoomControlComponent,
    MapTooltipComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    LayerSelectComponent,
    HighlightSelectorComponent,
    ZoomControlComponent,
    MapTooltipComponent
  ]
})
export class MapUiModule { }
