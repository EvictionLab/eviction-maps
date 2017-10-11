import { async, tick, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

import { UiDialogComponent } from './ui-dialog.component';

describe('UiDialogComponent', () => {
  let component: UiDialogComponent;
  let fixture: ComponentFixture<UiDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ModalModule.forRoot() ],
      declarations: [ UiDialogComponent ],
      providers: [ BsModalService, BsModalRef ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiDialogComponent);
    component = fixture.componentInstance;
    component.title = 'test title';
    component.content = [
      { type: 'text', data: 'hello world' },
      { type: 'checkbox', data: { value: false, label: 'check test' } }
    ];
    component.buttons = { ok: true, cancel: true };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog and emit data on button click', fakeAsync(() => {
    let returnValue;
    component.buttonClicked.subscribe((d) => { returnValue = d; });
    const buttons = fixture.debugElement.queryAll(By.css('.btn'));
    buttons[0].triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(returnValue.accepted).toBeTruthy();
  }));
});
