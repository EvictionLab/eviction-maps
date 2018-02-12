import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RankingService } from './ranking.service';
import { RankingModule } from './ranking.module';

describe('RankingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RankingService, TranslateService],
      imports: [
        RankingModule.forRoot({ dataUrl: 'https://fakeurl.com/' }),
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    });
  });

  it('should be created', inject([RankingService], (service: RankingService) => {
    expect(service).toBeTruthy();
  }));
});
