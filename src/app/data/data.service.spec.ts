import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it(
    'should make a single http request for data for a single year', 
    inject(
      [DataService, HttpTestingController], 
      (service: DataService, backend: HttpTestingController) => {
        service.getTileData('states', [50, 50], 'featureName', false).subscribe();
        backend.expectOne((req: HttpRequest<any>) => {
          return req.url.includes('states')
            && req.method === 'GET'
            && req.responseType === 'arraybuffer';
        }, `GET request to endpoint with data`);
      }
    )
  )
});
