import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphModule } from 'angular-d3-graph/module';
import { UiModule } from '../../ui/ui.module';

import { DataPanelComponent } from './data-panel.component';
import { DownloadFormComponent } from './download-form/download-form.component';
import { SocialSharePopupDirective } from './social-share-popup.directive';

@NgModule({
  exports: [ DataPanelComponent ],
  imports: [
    CommonModule,
    FormsModule,
    UiModule,
    GraphModule.forRoot()
  ],
  declarations: [ DataPanelComponent, DownloadFormComponent, SocialSharePopupDirective ],
  entryComponents: [ DataPanelComponent, DownloadFormComponent ]
})
export class DataPanelModule { }
