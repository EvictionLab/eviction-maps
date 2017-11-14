import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMapLegendComponent } from './ui-map-legend.component';

describe('UiMapLegendComponent', () => {
  let component: UiMapLegendComponent;
  let fixture: ComponentFixture<UiMapLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiMapLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMapLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
