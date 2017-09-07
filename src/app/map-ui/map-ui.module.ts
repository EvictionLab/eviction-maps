import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { LayerSelectComponent } from './layer-select/layer-select.component';
import { HighlightSelectorComponent } from './highlight-selector/highlight-selector.component';
import { ZoomControlComponent } from './zoom-control/zoom-control.component';

@NgModule({
  exports: [
    LayerSelectComponent,
    HighlightSelectorComponent,
    ZoomControlComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [ LayerSelectComponent, HighlightSelectorComponent, ZoomControlComponent ]
})
export class MapUiModule { }
