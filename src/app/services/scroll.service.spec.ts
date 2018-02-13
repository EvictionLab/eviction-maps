import { TestBed, inject } from '@angular/core/testing';
import { PageScrollService } from 'ng2-page-scroll';

import { ScrollService } from './scroll.service';
import { PlatformService } from './platform.service';

describe('ScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollService, PlatformService, PageScrollService]
    });
  });

  it('should be created', inject([ScrollService], (service: ScrollService) => {
    expect(service).toBeTruthy();
  }));
});
