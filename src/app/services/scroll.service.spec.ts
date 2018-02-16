import { TestBed, inject } from '@angular/core/testing';

import { ScrollService } from './scroll.service';
import { PlatformService } from './platform.service';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

describe('ScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ Ng2PageScrollModule ],
      providers: [ ScrollService, PlatformService ]
    });
  });

  it('should be created', inject([ScrollService], (service: ScrollService) => {
    expect(service).toBeTruthy();
  }));
});
