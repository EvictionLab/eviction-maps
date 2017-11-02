import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapboxComponent } from './mapbox/mapbox.component';
import { MapComponent } from './map/map.component';
import { UiModule } from '../../ui/ui.module';


@NgModule({
  exports: [
    MapboxComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    UiModule
  ],
  declarations: [MapboxComponent, MapComponent]
})
export class MapModule { }
