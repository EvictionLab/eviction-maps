import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be visible when indeterminate is set', () => {
    component.indeterminate = true;
    fixture.detectChanges();
    expect(fixture.debugElement.styles.display)
      .toBe('block');
  });

  it('should be visible when progress is set', () => {
    component.progress = 50;
    fixture.detectChanges();
    expect(fixture.debugElement.styles.display)
      .toBe('block');
  });

  it('should be hidden when neither progress or indeterminate is set', () => {
    expect(fixture.debugElement.styles.display)
      .toBe('none');
  });

});
