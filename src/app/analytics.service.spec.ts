import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { PlatformService } from './platform.service';

describe('AnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsService, PlatformService ]
    });
  });

  it('should be created', inject([AnalyticsService], (service: AnalyticsService) => {
    expect(service).toBeTruthy();
  }));
});
