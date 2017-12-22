import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingToolComponent } from './ranking-tool/ranking-tool.component';
import { RankingUiComponent } from './ranking-ui/ranking-ui.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { RankingPanelComponent } from './ranking-panel/ranking-panel.component';
import { RankingService } from './ranking.service';
import { RankingScaleComponent } from './ranking-scale/ranking-scale.component';

export class RankingConfig {
  dataUrl: string
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RankingToolComponent, RankingUiComponent, RankingListComponent, RankingPanelComponent, RankingScaleComponent]
})
export class RankingModule {
  static forRoot(config: RankingConfig): ModuleWithProviders {
    return {
      ngModule: RankingModule,
      providers: [RankingService, {provide: 'config', useValue: config}]
    };
  }
}
