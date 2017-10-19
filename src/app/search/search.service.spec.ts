import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { SearchService } from './search.service';

describe('SearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [SearchService]
    });
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
});
