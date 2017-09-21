import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearSliderComponent } from './year-slider.component';

describe('YearSliderComponent', () => {
  let component: YearSliderComponent;
  let fixture: ComponentFixture<YearSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
