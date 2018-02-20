import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RankingToolComponent } from './ranking-tool/ranking-tool.component';
import { RankingUiComponent } from './ranking-ui/ranking-ui.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { RankingPanelComponent } from './ranking-panel/ranking-panel.component';
import { RankingService } from './ranking.service';
import { UiModule } from '../ui/ui.module';

export class RankingConfig {
  cityUrl: string;
  stateUrl: string;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UiModule,
    TranslateModule
  ],
  declarations: [
    RankingToolComponent,
    RankingUiComponent,
    RankingListComponent,
    RankingPanelComponent
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
