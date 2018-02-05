import { TestBed, inject } from '@angular/core/testing';

import { ToggleScrollService } from './toggle-scroll.service';

describe('ToggleScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToggleScrollService]
    });
  });

  it('should be created', inject([ToggleScrollService], (service: ToggleScrollService) => {
    expect(service).toBeTruthy();
  }));
});
