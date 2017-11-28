import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { TranslateModule } from '@ngx-translate/core';

import { MapToolComponent } from './map-tool.component';
import { MapModule } from './map/map.module';
import { UiModule } from '../ui/ui.module';
import { DataPanelModule } from './data-panel/data-panel.module';
import { DataService } from '../data/data.service';
import { HeaderBarComponent } from './header-bar/header-bar.component';

@NgModule({
  declarations: [ MapToolComponent, HeaderBarComponent ],
  exports: [ MapToolComponent ],
  imports: [
    CommonModule,
    HttpModule,
    UiModule,
    DataPanelModule,
    MapModule,
    Ng2PageScrollModule,
    TranslateModule
  ],
  providers: [ DataService ]
})
export class MapToolModule { }
