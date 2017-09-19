import { async, tick, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ZoomControlComponent } from './zoom-control.component';

describe('ZoomControlComponent', () => {
  let component: ZoomControlComponent;
  let fixture: ComponentFixture<ZoomControlComponent>;
  let inputEl;
  const defaultZoom = 10;
  const defaultMinZoom = 0;
  const defaultMaxZoom = 20;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomControlComponent);
    component = fixture.componentInstance;
    component.minZoom = defaultMinZoom;
    component.maxZoom = defaultMaxZoom;
    component.zoom = defaultZoom;
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the input value to the default zoom', () => {
    fixture.detectChanges();
    expect(+inputEl.nativeElement.value).toEqual(defaultZoom);
  });

  it('should not display without a zoom value', fakeAsync(() => {
    component.zoom = null;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('input')) === null).toBeTruthy();
  }));

  it('should set the input max and min', () => {
    expect(+inputEl.nativeElement.min).toEqual(defaultMinZoom);
    expect(+inputEl.nativeElement.max).toEqual(defaultMaxZoom);
  });

  it('should emit the updated value when changed', fakeAsync(() => {
    const newVal = 6;
    inputEl.nativeElement.value = newVal;
    inputEl.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.zoom).toEqual(newVal);
  }));
});
