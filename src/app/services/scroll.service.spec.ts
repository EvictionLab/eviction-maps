import { TestBed, inject } from '@angular/core/testing';

import { ScrollService } from './scroll.service';
import { PlatformService } from './platform.service';
import { NgxPageScrollModule } from 'ngx-page-scroll';

describe('ScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ NgxPageScrollModule ],
      providers: [ ScrollService, PlatformService ]
    });
  });

  it('should be created', inject([ScrollService], (service: ScrollService) => {
    expect(service).toBeTruthy();
  }));
});
