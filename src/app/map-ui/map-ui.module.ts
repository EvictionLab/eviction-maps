import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { LayerSelectComponent } from './layer-select/layer-select.component';
import { HighlightSelectorComponent } from './highlight-selector/highlight-selector.component';
import { ZoomControlComponent } from './zoom-control/zoom-control.component';
import { MapTooltipComponent } from './map-tooltip/map-tooltip.component';
import { PredictiveSearchComponent } from './predictive-search/predictive-search.component';

@NgModule({
  exports: [
    LayerSelectComponent,
    HighlightSelectorComponent,
    ZoomControlComponent,
    MapTooltipComponent,
    PredictiveSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule,
  ],
  declarations: [
    LayerSelectComponent,
    HighlightSelectorComponent,
    ZoomControlComponent,
    MapTooltipComponent,
    PredictiveSearchComponent
  ]
})
export class MapUiModule { }
