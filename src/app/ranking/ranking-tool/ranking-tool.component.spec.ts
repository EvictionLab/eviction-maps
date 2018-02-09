import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UiModule } from '../../ui/ui.module';
import { RankingService } from '../ranking.service';
import { RankingToolComponent } from './ranking-tool.component';
import { RankingUiComponent } from '../ranking-ui/ranking-ui.component';
import { RankingListComponent } from '../ranking-list/ranking-list.component';
import { RankingPanelComponent } from '../ranking-panel/ranking-panel.component';

describe('RankingToolComponent', () => {
  let component: RankingToolComponent;
  let fixture: ComponentFixture<RankingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RankingToolComponent,
        RankingUiComponent,
        RankingListComponent,
        RankingPanelComponent
      ],
      imports: [
        UiModule, RouterTestingModule
      ]
    });
    TestBed.overrideComponent(RankingToolComponent, {
      set: {
        providers: [
          {
            provide: RankingService, useValue: {
              loadCsvData: () => { },
              isReady: { subscribe: () => { } }
            }
          }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
