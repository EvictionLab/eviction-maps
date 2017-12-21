import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingService } from '../ranking.service';
import { RankingToolComponent } from './ranking-tool.component';
import { RankingUiComponent } from '../ranking-ui/ranking-ui.component';
import { RankingListComponent } from '../ranking-list/ranking-list.component';
import { RankingScaleComponent } from '../ranking-scale/ranking-scale.component';
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
        RankingScaleComponent,
        RankingPanelComponent
      ]
    })
    TestBed.overrideComponent(RankingToolComponent, {
      set: {
        providers: [
          { provide: RankingService, useValue: { loadCsvData: () => {} } }
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
