import { TestBed, inject } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollService]
    });
  });

  it('should be created', inject([ScrollService], (service: ScrollService) => {
    expect(service).toBeTruthy();
  }));
});
