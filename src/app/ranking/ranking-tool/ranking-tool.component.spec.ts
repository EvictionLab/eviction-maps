import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingToolComponent } from './ranking-tool.component';

describe('RankingToolComponent', () => {
  let component: RankingToolComponent;
  let fixture: ComponentFixture<RankingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingToolComponent ]
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
