import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCheckboxComponent } from './ui-checkbox.component';

describe('UiCheckboxComponent', () => {
  let component: UiCheckboxComponent;
  let fixture: ComponentFixture<UiCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle left and right', () => {

  });
});
