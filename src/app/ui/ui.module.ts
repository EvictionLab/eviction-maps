import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { UiSelectComponent } from './ui-select/ui-select.component';
import { PredictiveSearchComponent } from './predictive-search/predictive-search.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { UiSliderComponent } from './ui-slider/ui-slider.component';
import { UiToggleComponent } from './ui-toggle/ui-toggle.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { UiDialogComponent } from './ui-dialog/ui-dialog.component';
import { UiDialogService } from './ui-dialog/ui-dialog.service';
import { UiHintComponent } from './ui-hint/ui-hint.component';
import { UiSwitchComponent } from './ui-switch/ui-switch.component';
import { UiCopyClipboardComponent } from './ui-copy-clipboard/ui-copy-clipboard.component';

@NgModule({
  exports: [
    UiSelectComponent,
    PredictiveSearchComponent,
    LocationSearchComponent,
    UiSliderComponent,
    UiToggleComponent,
    ProgressBarComponent,
    UiHintComponent,
    UiSwitchComponent,
    UiCopyClipboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule,
    TranslateModule
  ],
  declarations: [
    UiSelectComponent,
    PredictiveSearchComponent,
    LocationSearchComponent,
    UiSliderComponent,
    UiToggleComponent,
    ProgressBarComponent,
    UiDialogComponent,
    UiHintComponent,
    UiSwitchComponent,
    UiCopyClipboardComponent
  ],
  providers: [ UiDialogService ],
  entryComponents: [ UiDialogComponent ]
})
export class UiModule { }
