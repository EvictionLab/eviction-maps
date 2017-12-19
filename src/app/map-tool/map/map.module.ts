import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxComponent } from './mapbox/mapbox.component';
import { MapComponent } from './map/map.component';
import { UiModule } from '../../ui/ui.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  exports: [
    MapboxComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    TranslateModule,
    TooltipModule.forRoot()
  ],
  declarations: [MapboxComponent, MapComponent]
})
export class MapModule { }
