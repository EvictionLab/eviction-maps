import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UiSliderComponent } from './ui-slider.component';

describe('UiSliderComponent', () => {
  let component: UiSliderComponent;
  let fixture: ComponentFixture<UiSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSliderComponent);
    component = fixture.componentInstance;
    component.min = 200;
    component.max = 1000;
    component.step = 10;
    component.value = 600;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be accept a default value and set the position', () => {
    expect(component.position).toEqual(0.5);
    expect(component.percent).toEqual('50%');
  });

  it('should accept a new value and update the position', () => {
    component.value = 800;
    component.updatePosition();
    fixture.detectChanges();
    expect(component.position).toEqual(0.75);
    expect(component.percent).toEqual('75%');
  });

  it('should not allow less than min value', () => {
    component.value = (-100);
    component.updatePosition();
    fixture.detectChanges();
    expect(component.value).toEqual(200);
    expect(component.position).toEqual(0);
    expect(component.percent).toEqual('0%');
  });

  it('should not exceed max value', () => {
    component.value = (10000);
    component.updatePosition();
    fixture.detectChanges();
    expect(component.value).toEqual(1000);
    expect(component.position).toEqual(1);
    expect(component.percent).toEqual('100%');
  });

  it('should round to the nearest step value', () => {
    component.value = (404);
    component.updatePosition();
    fixture.detectChanges();
    expect(component.value).toEqual(400);
    expect(component.position).toEqual(0.25);
    expect(component.percent).toEqual('25%');
  });

  // TODO: fix this test, change is not firing on mousedown
  // it('should emit the new value when changed', fakeAsync(() => {
  //   let newValue = -1;
  //   component.change.subscribe((value: number) => { newValue = value; });
  //   fixture.debugElement.triggerEventHandler('mousedown', null);
  //   tick();
  //   fixture.detectChanges();
  //   console.log(newValue);
  //   expect(newValue).toBeTruthy();
  // }));
});
