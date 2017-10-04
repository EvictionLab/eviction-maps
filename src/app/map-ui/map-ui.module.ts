import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { UiSelectComponent } from './ui-select/ui-select.component';
import { MapTooltipComponent } from './map-tooltip/map-tooltip.component';
import { PredictiveSearchComponent } from './predictive-search/predictive-search.component';
import { UiSliderComponent } from './ui-slider/ui-slider.component';

@NgModule({
  exports: [
    UiSelectComponent,
    MapTooltipComponent,
    PredictiveSearchComponent,
    UiSliderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule,
  ],
  declarations: [
    UiSelectComponent,
    MapTooltipComponent,
    PredictiveSearchComponent,
    UiSliderComponent
  ]
})
export class MapUiModule { }
