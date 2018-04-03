import {
  async, tick, fakeAsync, ComponentFixture, TestBed, discardPeriodicTasks
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule, TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { PredictiveSearchComponent } from './predictive-search.component';
import { UiModule } from '../../ui/ui.module';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ServicesModule } from '../../services/services.module';

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('PredictiveSearchComponent', () => {
  let component: PredictiveSearchComponent;
  let fixture: ComponentFixture<PredictiveSearchComponent>;
  let inputEl;
  let clearEl;
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
      declarations: [ ],
      imports: [ FormsModule, TypeaheadModule.forRoot(), UiModule, ServicesModule.forRoot() ],
      providers: [ { provide: TranslatePipe, useClass: TranslatePipeMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveSearchComponent);
    component = fixture.componentInstance;
    component.optionsLimit = defaultOptionsLimit;
    component.options = defaultOptions;
    component.optionField = defaultOptionField;
    component.updateSelection();
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input'));
    clearEl = fixture.debugElement.query(By.css('.clear'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display results on input', async(() => {
    const el = fixture.debugElement.query(By.css('input')).nativeElement;
    el.value = 't';
    const event = new Event('input'); // typeahead is triggered by 'input' event
    el.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.dropdown') === null).toBeFalsy();
    });
  }));

  it('should display the option field property', async(() => {
    const el = fixture.debugElement.query(By.css('input')).nativeElement;
    el.value = 't';
    const event = new Event('input');
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
    const newMatch = new TypeaheadMatch(defaultOptions[0].name);
    component.updateSelection(newMatch);
    tick();
    fixture.detectChanges();
    expect(selection.selection).toEqual(newMatch.value);
    discardPeriodicTasks();
  }));

  it('should not display the clear button without input', fakeAsync(() => {
    const clearElStyle = clearEl.nativeElement.style;
    expect(clearElStyle.display).toEqual('none');
    discardPeriodicTasks();
  }));

  it('should display the clear button with input', () => {
    component.selected = 't';
    fixture.detectChanges();
    expect(expect(clearEl.nativeElement.style.display).toEqual('block'));
  });

  it('should clear the selection when clear button is clicked', fakeAsync(() => {
    component.updateSelection(new TypeaheadMatch(defaultOptions[0].name));
    tick();
    fixture.detectChanges();
    clearEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('input').value.trim())
        .toEqual('');
    });
    discardPeriodicTasks();
  }));

  it('should hide the clear button after it is clicked', fakeAsync(() => {
    component.updateSelection(new TypeaheadMatch(defaultOptions[0].name));
    tick();
    fixture.detectChanges();
    clearEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(expect(clearEl.nativeElement.style.display).toEqual('none'));
    });
    discardPeriodicTasks();
  }));
});
