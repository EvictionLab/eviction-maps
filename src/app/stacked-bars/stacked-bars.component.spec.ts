import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedBarsComponent } from './stacked-bars.component';

describe('StackedBarsComponent', () => {
  let component: StackedBarsComponent;
  let fixture: ComponentFixture<StackedBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
