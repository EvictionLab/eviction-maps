import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSelectDateRangeComponent } from './ui-select-date-range.component';

import { UiModule } from '../ui.module';

describe('UiSelectDateRangeComponent', () => {
  let component: UiSelectDateRangeComponent;
  let fixture: ComponentFixture<UiSelectDateRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSelectDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
