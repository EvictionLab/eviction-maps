import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { MapboxComponent } from './mapbox/mapbox.component';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';
import { UiModule } from '../../ui/ui.module';
import { LocationCardsModule } from '../location-cards/location-cards.module';
import { UiMapLegendComponent } from './map-legend/ui-map-legend.component';


@NgModule({
  exports: [
    MapboxComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    LocationCardsModule,
    TranslateModule,
    TooltipModule.forRoot()
  ],
  declarations: [MapboxComponent, MapComponent, UiMapLegendComponent ],
  providers: [MapService]
})
export class MapModule { }
