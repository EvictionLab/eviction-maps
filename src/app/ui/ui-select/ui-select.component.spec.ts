import {
  async, tick, fakeAsync, ComponentFixture, TestBed, flushMicrotasks, discardPeriodicTasks
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UiSelectComponent } from './ui-select.component';
import { UiModule } from '../../ui/ui.module';

describe('UiSelectComponent', () => {
  let component: UiSelectComponent;
  let fixture: ComponentFixture<UiSelectComponent>;
  let buttonEl;
  let expectedValues;
  let menuEls;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [BsDropdownModule.forRoot(), UiModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSelectComponent);
    component = fixture.componentInstance;
    buttonEl  = fixture.debugElement.query(By.css('.btn'));
    expectedValues = [
      { id: 'testgroup1', name: 'Test Group 1' }, { id: 'testgroup2', name: 'Test Group 2' }
    ];
    component.labelProperty = 'name';
    component.values = expectedValues;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display the selected value', () => {
    expect(buttonEl.nativeElement.textContent).toContain(expectedValues[0].name);
  });

  it('should set the selected value to the first option', () => {
    expect(component.selectedValue).toEqual(expectedValues[0]);
  });

  it('should have menu items for the provided values', fakeAsync(() => {
    fixture.detectChanges();
    buttonEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    menuEls = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    expect(menuEls[0].nativeElement.textContent).toContain(expectedValues[0].name);
    expect(menuEls[1].nativeElement.textContent).toContain(expectedValues[1].name);
  }));

  it('should raise the selected value when clicked', fakeAsync(() => {
    let selectedGroup;
    buttonEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    menuEls = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    component.change.subscribe((group) => { selectedGroup = group; });
    menuEls[1].triggerEventHandler('click', null);
    expect(selectedGroup).toBe(expectedValues[1]);
  }));
});
