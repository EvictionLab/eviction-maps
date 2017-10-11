import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
