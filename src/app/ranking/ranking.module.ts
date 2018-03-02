import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { RankingToolComponent } from './ranking-tool/ranking-tool.component';
import { RankingUiComponent } from './ranking-ui/ranking-ui.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { RankingPanelComponent } from './ranking-panel/ranking-panel.component';
import { RankingService } from './ranking.service';
import { UiModule } from '../ui/ui.module';
import { EvictorsComponent } from './ranking-tool/evictors/evictors.component';
import { EvictionsComponent } from './ranking-tool/evictions/evictions.component';

export class RankingConfig {
  cityUrl: string;
  stateUrl: string;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UiModule,
    TranslateModule,
    PopoverModule.forRoot()
  ],
  declarations: [
    RankingToolComponent,
    RankingUiComponent,
    RankingListComponent,
    RankingPanelComponent,
    EvictorsComponent,
    EvictionsComponent
  ]
})
export class RankingModule {
  static forRoot(config: RankingConfig): ModuleWithProviders {
    return {
      ngModule: RankingModule,
      providers: [RankingService, {provide: 'config', useValue: config}]
    };
  }
}
