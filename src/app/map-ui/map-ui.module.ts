import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { LayerSelectComponent } from './layer-select/layer-select.component';

@NgModule({
  exports: [
    LayerSelectComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [ LayerSelectComponent ]
})
export class MapUiModule { }
