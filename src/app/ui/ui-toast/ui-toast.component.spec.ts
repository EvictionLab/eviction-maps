import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiToastComponent } from './ui-toast.component';

describe('UiToastComponent', () => {
  let component: UiToastComponent;
  let fixture: ComponentFixture<UiToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
