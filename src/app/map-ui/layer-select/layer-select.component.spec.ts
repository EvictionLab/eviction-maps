import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerSelectComponent } from './layer-select.component';

describe('LayerSelectComponent', () => {
  let component: LayerSelectComponent;
  let fixture: ComponentFixture<LayerSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
