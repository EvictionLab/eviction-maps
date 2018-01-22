import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingScaleComponent } from './ranking-scale.component';

describe('RankingScaleComponent', () => {
  let component: RankingScaleComponent;
  let fixture: ComponentFixture<RankingScaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingScaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
