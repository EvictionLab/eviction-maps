import { async, tick, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MapDataAttribute } from '../map-data-attribute';

import { HighlightSelectorComponent } from './highlight-selector.component';

describe('HighlightSelectorComponent', () => {
  let component: HighlightSelectorComponent;
  let fixture: ComponentFixture<HighlightSelectorComponent>;
  let buttonEl;
  const expectedDataAttributes: Array<MapDataAttribute> = [
    { id: 'attr1', name: 'Sample Attribute', fillStops: { 'test': [[]] } },
    { id: 'attr2', name: 'Another Attribute', fillStops: { 'test': [[]] } }
  ];
  let menuEls;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlightSelectorComponent ],
      imports: [BsDropdownModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightSelectorComponent);
    component = fixture.componentInstance;
    component.attributes = expectedDataAttributes;
    fixture.detectChanges();
    buttonEl = fixture.debugElement.query(By.css('.btn'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // it('should not show the component when there are no data attributes', () => {
  //   buttonEl = fixture.debugElement.query(By.css('.btn-data-attribute-select'));
  //   expect(buttonEl).toBeFalsy();
  // });

  it('should accept an input for data attribute', () => {
    expect(buttonEl.nativeElement.textContent).toContain(expectedDataAttributes[0].name);
  });

  it('should show options in the menu for available data attributes', fakeAsync(() => {
    buttonEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    menuEls = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    expect(menuEls[0].nativeElement.textContent).toContain(expectedDataAttributes[0].name);
    expect(menuEls[1].nativeElement.textContent).toContain(expectedDataAttributes[1].name);
  }));

  it('should emit the selected data attribute when clicked', fakeAsync(() => {
    let selectedAttr;
    buttonEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    menuEls = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    component.change.subscribe((attr) => { selectedAttr = attr;  });
    menuEls[1].triggerEventHandler('click', null);
    expect(selectedAttr).toBe(expectedDataAttributes[1]);
  }));

  it('should update the button with the selected data attribute', fakeAsync(() => {
    buttonEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    menuEls = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    menuEls[1].triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    buttonEl = fixture.debugElement.query(By.css('.btn'));
    expect(buttonEl.nativeElement.textContent).toContain(expectedDataAttributes[1].name);
  }));
});
