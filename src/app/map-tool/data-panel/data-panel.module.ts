import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphModule } from 'angular-d3-graph/module';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { UiModule } from '../../ui/ui.module';
import { DataPanelComponent } from './data-panel.component';
import { DownloadFormComponent } from './download-form/download-form.component';
import { SocialSharePopupDirective } from './social-share-popup.directive';
import { PlatformService } from '../../platform.service';
import { EvictionGraphsComponent } from './eviction-graphs/eviction-graphs.component';

@NgModule({
  exports: [ DataPanelComponent ],
  imports: [
    CommonModule,
    FormsModule,
    UiModule,
    GraphModule.forRoot(),
    TranslateModule,
    PopoverModule.forRoot()
  ],
  declarations: [
    DataPanelComponent,
    DownloadFormComponent,
    SocialSharePopupDirective,
    EvictionGraphsComponent
  ],
  providers: [ PlatformService ],
  entryComponents: [ DataPanelComponent, DownloadFormComponent ]
})
export class DataPanelModule { }
