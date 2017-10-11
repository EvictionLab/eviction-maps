import { TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';


import { UiDialogService } from './ui-dialog.service';

describe('UiDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ModalModule.forRoot() ],
      providers: [BsModalService, UiDialogService]
    });
  });

  it('should be created', inject([UiDialogService], (service: UiDialogService) => {
    expect(service).toBeTruthy();
  }));
});
