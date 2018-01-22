import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingPanelComponent } from './ranking-panel.component';

describe('RankingPanelComponent', () => {
  let component: RankingPanelComponent;
  let fixture: ComponentFixture<RankingPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
