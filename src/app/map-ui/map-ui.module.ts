import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { UiSelectComponent } from './ui-select/ui-select.component';
import { MapTooltipComponent } from './map-tooltip/map-tooltip.component';
import { PredictiveSearchComponent } from './predictive-search/predictive-search.component';
import { UiSliderComponent } from './ui-slider/ui-slider.component';
import { UiToggleComponent } from './ui-toggle/ui-toggle.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { UiDialogComponent } from './ui-dialog/ui-dialog.component';
import { UiDialogService } from './ui-dialog/ui-dialog.service';
import { UiHintComponent } from './ui-hint/ui-hint.component';


@NgModule({
  exports: [
    UiSelectComponent,
    MapTooltipComponent,
    PredictiveSearchComponent,
    UiSliderComponent,
    UiToggleComponent,
    ProgressBarComponent,
    UiHintComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule
  ],
  declarations: [
    UiSelectComponent,
    MapTooltipComponent,
    PredictiveSearchComponent,
    UiSliderComponent,
    UiToggleComponent,
    ProgressBarComponent,
    UiDialogComponent,
    UiHintComponent
  ],
  providers: [ UiDialogService ],
  entryComponents: [ UiDialogComponent ]
})
export class MapUiModule { }
