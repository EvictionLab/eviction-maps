import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCopyClipboardComponent } from './ui-copy-clipboard.component';

describe('UiCopyClipboardComponent', () => {
  let component: UiCopyClipboardComponent;
  let fixture: ComponentFixture<UiCopyClipboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiCopyClipboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCopyClipboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
