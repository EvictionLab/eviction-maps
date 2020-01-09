import { TestBed, inject } from '@angular/core/testing';

import { ScrollService } from './scroll.service';
import { PlatformService } from './platform.service';

describe('ScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ ScrollService, PlatformService ]
    });
  });

  it('should be created', inject([ScrollService], (service: ScrollService) => {
    expect(service).toBeTruthy();
  }));
});
