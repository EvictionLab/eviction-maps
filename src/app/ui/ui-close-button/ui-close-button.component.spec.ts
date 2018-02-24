import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCloseButtonComponent } from './ui-close-button.component';
import { UiModule } from '../ui.module';

describe('UiCloseButtonComponent', () => {
  let component: UiCloseButtonComponent;
  let fixture: ComponentFixture<UiCloseButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [UiModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCloseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
