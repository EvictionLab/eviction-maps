import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTooltipComponent } from './map-tooltip.component';

describe('MapTooltipComponent', () => {
  let component: MapTooltipComponent;
  let fixture: ComponentFixture<MapTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
