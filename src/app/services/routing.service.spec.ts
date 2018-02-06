import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RoutingService } from './routing.service';
import { ServicesModule } from './services.module';

describe('RoutingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ServicesModule.forRoot() ],
      providers: [RoutingService]
    });
  });

  it('should be created', inject([RoutingService], (service: RoutingService) => {
    expect(service).toBeTruthy();
  }));
});
