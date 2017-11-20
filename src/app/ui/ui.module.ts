import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { UiSelectComponent } from './ui-select/ui-select.component';
import { PredictiveSearchComponent } from './predictive-search/predictive-search.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { UiSliderComponent } from './ui-slider/ui-slider.component';
import { UiToggleComponent } from './ui-toggle/ui-toggle.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { UiDialogComponent } from './ui-dialog/ui-dialog.component';
import { UiDialogService } from './ui-dialog/ui-dialog.service';
import { UiHintComponent } from './ui-hint/ui-hint.component';
import { LocationCardsComponent } from './location-cards/location-cards.component';
import { UiMapLegendComponent } from './ui-map-legend/ui-map-legend.component';
import { UiToastComponent } from './ui-toast/ui-toast.component';

@NgModule({
  exports: [
    UiSelectComponent,
    LocationCardsComponent,
    PredictiveSearchComponent,
    LocationSearchComponent,
    UiSliderComponent,
    UiToggleComponent,
    ProgressBarComponent,
    UiHintComponent,
    UiMapLegendComponent,
    UiToastComponent
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
    LocationCardsComponent,
    PredictiveSearchComponent,
    LocationSearchComponent,
    UiSliderComponent,
    UiToggleComponent,
    ProgressBarComponent,
    UiDialogComponent,
    UiHintComponent,
    UiMapLegendComponent,
    UiToastComponent
  ],
  providers: [ UiDialogService ],
  entryComponents: [ UiDialogComponent, LocationCardsComponent ]
})
export class UiModule { }
