import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MapToolService } from './map-tool.service';
import { ServicesModule } from '../services/services.module';

describe('MapToolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapToolService, TranslateService ],
      imports: [
        TranslateModule.forRoot(),
        ServicesModule.forRoot()
      ]
    });
  });

  it('should be created', inject([MapToolService], (service: MapToolService) => {
    expect(service).toBeTruthy();
  }));

});
