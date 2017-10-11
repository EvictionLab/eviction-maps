import { TestBed, inject } from '@angular/core/testing';

import { UiDialogService } from './ui-dialog.service';

describe('UiDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiDialogService]
    });
  });

  it('should be created', inject([UiDialogService], (service: UiDialogService) => {
    expect(service).toBeTruthy();
  }));
});
