import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { LayerSelectComponent } from './layer-select/layer-select.component';
import { HighlightSelectorComponent } from './highlight-selector/highlight-selector.component';

@NgModule({
  exports: [
    LayerSelectComponent,
    HighlightSelectorComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [ LayerSelectComponent, HighlightSelectorComponent ]
})
export class MapUiModule { }
