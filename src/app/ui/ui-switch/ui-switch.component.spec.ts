import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSwitchComponent } from './ui-switch.component';

describe('UiSwitchComponent', () => {
  let component: UiSwitchComponent;
  let fixture: ComponentFixture<UiSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle left and right', () => {

  });
});
