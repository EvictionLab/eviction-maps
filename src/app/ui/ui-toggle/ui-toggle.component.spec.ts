import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UiToggleComponent } from './ui-toggle.component';

describe('UiToggleComponent', () => {
  let component: UiToggleComponent;
  let fixture: ComponentFixture<UiToggleComponent>;
  let toggleObjectValues;
  let toggleStringValues;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    toggleObjectValues = [
      { id: 'test1', name: 'Toggle 1' },
      { id: 'test2', name: 'Toggle 2' },
      { id: 'test3', name: 'Toggle 3' }
    ];
    toggleStringValues = ['Toggle 1', 'Toggle 2', 'Toggle 3' ];
    fixture = TestBed.createComponent(UiToggleComponent);
    component = fixture.componentInstance;
    component.values = toggleObjectValues;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should start with the first value selected if no other is provided', () => {
    component.values = toggleObjectValues;
    fixture.detectChanges();
    const selectedEl = fixture.debugElement.query(By.css('.selected'));
    expect(component.selectedValue).toEqual(toggleObjectValues[0]);
    expect(selectedEl.nativeElement.textContent).toContain(toggleObjectValues[0].name);
  });

  it('should start with the provided value selected', () => {
    component.values = toggleObjectValues;
    component.selectedValue = toggleObjectValues[1];
    fixture.detectChanges();
    const selectedEl = fixture.debugElement.query(By.css('.selected'));
    expect(component.selectedValue).toEqual(toggleObjectValues[1]);
    expect(selectedEl.nativeElement.textContent).toContain(toggleObjectValues[1].name);
  });

  it('should display the string value if string array is provided', () => {
    component.values = toggleStringValues;
    component.selectedValue = toggleStringValues[1];
    fixture.detectChanges();
    const selectedEl = fixture.debugElement.query(By.css('.selected'));
    expect(component.selectedValue).toEqual(toggleStringValues[1]);
    expect(selectedEl.nativeElement.textContent).toContain(toggleStringValues[1]);
  });

  it('should display the value in `labelProperty` if object array is provided', () => {
    const vals = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }];
    component.labelProperty = 'label';
    component.values = vals;
    component.selectedValue = vals[1];
    fixture.detectChanges();
    const selectedEl = fixture.debugElement.query(By.css('.selected'));
    expect(component.selectedValue).toEqual(vals[1]);
    expect(selectedEl.nativeElement.textContent).toContain(vals[1].label);
  });

  it('should switch value and trigger output on click / press', fakeAsync(() => {
    let subscribeVal;
    const vals = [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }];
    component.labelProperty = 'label';
    component.values = vals;
    component.selectedValue = vals[1];
    fixture.detectChanges();
    tick();
    component.selectedValueChanged.subscribe((val: any) => { subscribeVal = val; });
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[2].triggerEventHandler('click', null);
    fixture.detectChanges();
    tick();
    const selectedEl = fixture.debugElement.query(By.css('.selected'));
    expect(component.selectedValue).toEqual(vals[2]);
    expect(selectedEl.nativeElement.textContent).toContain(vals[2].label);
    expect(subscribeVal.label).toEqual(vals[2].label);
  }));

});
