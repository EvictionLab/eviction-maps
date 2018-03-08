import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

import { MapToolComponent } from './map-tool.component';
import { MapModule } from './map/map.module';
import { UiModule } from '../ui/ui.module';
import { DataPanelModule } from './data-panel/data-panel.module';
import { MapToolService } from './map-tool.service';
import { EmbedComponent } from './embed/embed.component';
import { FeatureOverviewComponent } from './feature-overview/feature-overview.component';


@NgModule({
  declarations: [ MapToolComponent, EmbedComponent, FeatureOverviewComponent ],
  exports: [ MapToolComponent ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxCarouselModule,
    UiModule,
    DataPanelModule,
    MapModule,
    Ng2PageScrollModule,
    TranslateModule
  ],
  providers: [MapToolService],
  entryComponents: [ FeatureOverviewComponent ]
})
export class MapToolModule { }
