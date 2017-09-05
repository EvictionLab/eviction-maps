import { async, tick, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { LayerSelectComponent } from './layer-select.component';
import { MapLayer } from '../map-layer';

describe('LayerSelectComponent', () => {
  let component: LayerSelectComponent;
  let fixture: ComponentFixture<LayerSelectComponent>;
  let buttonEl;
  let expectedLayers;
  let menuEls;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerSelectComponent ],
      imports: [BsDropdownModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerSelectComponent);
    component = fixture.componentInstance;
    buttonEl  = fixture.debugElement.query(By.css('.btn'));
    expectedLayers = [
      { id: 'testgroup1', name: 'Test Group 1' }, { id: 'testgroup2', name: 'Test Group 2' }
    ];
    component.layers = expectedLayers;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display the selected layer', () => {
    expect(buttonEl.nativeElement.textContent).toContain(expectedLayers[0].name);
  });

  it('should set the selected layer to the first option', () => {
    expect(component.selectedLayer).toEqual(expectedLayers[0]);
  });

  it('should have menu items for the provided layers', fakeAsync(() => {
    fixture.detectChanges();
    buttonEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    menuEls = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    expect(menuEls[0].nativeElement.textContent).toContain(expectedLayers[0].name);
    expect(menuEls[1].nativeElement.textContent).toContain(expectedLayers[1].name);
  }));

  it('should raise the selected layer when clicked', fakeAsync(() => {
    fixture.detectChanges();
    let selectedGroup: MapLayer;
    buttonEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    menuEls = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    component.change.subscribe((group: MapLayer) => { selectedGroup = group; });
    menuEls[1].triggerEventHandler('click', null);
    expect(selectedGroup).toBe(expectedLayers[1]);
  }));
});
