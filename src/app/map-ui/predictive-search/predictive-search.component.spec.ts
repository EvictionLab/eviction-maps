import { async, tick, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PredictiveSearchComponent } from './predictive-search.component';

describe('PredictiveSearchComponent', () => {
  let component: PredictiveSearchComponent;
  let fixture: ComponentFixture<PredictiveSearchComponent>;
  let inputEl;
  const defaultOptionsLimit = 5;
  const defaultOptionField = 'name';
  const defaultOptions = [
    {name: 'Test 1'},
    {name: 'Test 2'},
    {name: 'Test 3'},
    {name: 'Test 4'},
    {name: 'Test 5'},
    {name: 'Test 6'}
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictiveSearchComponent ],
      imports: [ FormsModule, TypeaheadModule.forRoot() ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveSearchComponent);
    component = fixture.componentInstance;
    component.optionsLimit = defaultOptionsLimit;
    component.options = defaultOptions;
    component.optionField = defaultOptionField;
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display results on input', async(() => {
    const el = inputEl.nativeElement;
    el.value = 't';
    const event = new KeyboardEvent('keyup', { 'key': 't' });
    el.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.dropdown') == null).toBeFalsy();
    });
  }));

  it('should display the option field property', async(() => {
    const el = inputEl.nativeElement;
    el.value = 't';
    const event = new KeyboardEvent('keyup', { 'key': 't' });
    el.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('li').textContent)
        .toContain(defaultOptions[0].name);
    });
  }));

  it('should emit the selection when clicked', fakeAsync(() => {
    let selection;
    component.selectionChange.subscribe((sel) => { selection = sel; });
    component.updateSelection(defaultOptions[0]);
    tick();
    fixture.detectChanges();
    expect(selection).toEqual(defaultOptions[0]);
  }));
});
