import { TestBed, inject } from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';

import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { UiDialogComponent } from './ui-dialog.component';
import { UiDialogService } from './ui-dialog.service';

describe('UiDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ModalModule.forRoot() ],
      declarations: [ UiDialogComponent ],
      providers: [BsModalService, UiDialogService]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [UiDialogComponent]
      }
    });
  });

  it('should be created', inject([UiDialogService], (service: UiDialogService) => {
    expect(service).toBeTruthy();
  }));

  it('should create a UiDialogComponent', inject([UiDialogService], (service: UiDialogService) => {
    service.showDialog('test dialog');
    expect(service.getCurrentDialog()).toBeTruthy();
  }));
});
