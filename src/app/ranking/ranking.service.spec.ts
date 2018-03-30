import { EventEmitter } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RankingService } from './ranking.service';
import { RankingModule } from './ranking.module';
import { Observable } from 'rxjs/Observable';

export class TranslateServiceStub {
  currentLang = 'en';
  translations = { 'en': {} };
  public get onLangChange(): EventEmitter<any> { return new EventEmitter<any>(); }
}


describe('RankingService', () => {
  // tslint:disable-next-line:max-line-length
  const csvString = `GEOID,name,parent-location,evictions,eviction-filings,eviction-rate,eviction-filing-rate,lon,lat,area-type
0100100,Abanda,Alabama,469.0,234.0,3908.33,1950.0,-85.5209,33.0886,2
0100124,Abbeville,Alabama,1.0,565.0,0.32,182.26,-85.2433,31.5676,2
0100460,Adamsville,Alabama,50.0,,11.55,,-86.9975,33.6429,2
0274610,Takotna,Alaska,112.0,3.0,1244.44,33.33,-156.1677,62.9772,2
0274830,Talkeetna,Alaska,23.0,248.0,15.75,169.86,-150.0856,62.2521,2
0275050,Tanacross,Alaska,303.0,55.0,2754.55,500.0,-143.4535,63.3324,2
0275077,Tanaina,Alaska,66.0,14.0,9.87,2.09,-149.4345,61.6553,2
0406260,Bisbee,Arizona,386.0,89.0,40.8,9.41,-109.9441,31.3869,2
0406470,Bitter Springs,Arizona,296.0,303.0,2276.92,2330.77,-111.6528,36.6255,2
0406610,Black Canyon City,Arizona,50.0,50.0,29.76,29.76,-112.1322,34.0723,2
0411230,Catalina Foothills,Arizona,469.0,,7.27,,-110.8594,32.3009,1
0411300,Cave Creek,Arizona,160.0,16.0,42.67,4.27,-111.9854,33.8478,2
0411370,Cedar Creek,Arizona,190.0,28.0,593.75,87.5,-110.1906,33.8938,2
0522180,Eudora,Arkansas,50.0,10.0,14.25,2.85,-91.2608,33.1093,2
0522240,Eureka Springs,Arkansas,8.0,10.0,2.27,2.83,-93.7378,36.4026,2
0522360,Evening Shade,Arkansas,17.0,23.0,43.59,58.97,-91.6185,36.0709,2
0522450,Everton,Arkansas,19.0,44.0,90.48,209.52,-92.9096,36.1542,2
0624638,Folsom,California,,3.0,,0.04,-121.1522,38.6765,1
0624680,Fontana,California,73.0,613.0,0.4,3.4,-117.4584,34.1331,0
0624722,Foothill Farms,California,19.0,2.0,0.35,0.04,-121.3453,38.6906,1
0624750,Forbestown,California,26.0,73.0,66.67,187.18,-121.2759,39.533,2`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RankingService,
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
      imports: [
        RankingModule.forRoot({
          cityUrl: 'https://fakeurl.com/', stateUrl: 'https://fakeurl.com/', evictorsUrl: ''
        }),
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    });
  });

  it('should be created', inject([RankingService], (service: RankingService) => {
    expect(service).toBeTruthy();
  }));

  it(
    'parse a CSV string into a RankLocation array',
    inject([RankingService], (service: RankingService) => {
      const locationsArray = service.parseEvictionsData(csvString);
      expect(locationsArray[4].geoId).toEqual('0274830');
      expect(locationsArray[4].evictions).toEqual(23);
      expect(locationsArray[4].evictionRate).toEqual(15.75);
      expect(locationsArray[4].name).toEqual('Talkeetna');
      expect(locationsArray[4].displayName).toEqual('Talkeetna, AK');
      expect(locationsArray[4].parentLocation).toEqual('Alaska');
      expect(locationsArray[4].displayParentLocation).toEqual('AK');
      expect(locationsArray[4].latLon).toEqual([ 62.2521, -150.0856 ]);
      expect(locationsArray[4].areaType).toEqual(2);
    })
  );

  it(
    'should filter and sort data based on parameters',
    inject([RankingService], (service: RankingService) => {
      service.evictions = service.parseEvictionsData(csvString);
      const filtered = service.getFilteredEvictions('Arizona', 2, 'evictions');
      expect(filtered.length).toEqual(5);
      expect(filtered[0].name).toEqual('Bisbee');
      expect(filtered[4].name).toEqual('Black Canyon City');
    })
  );

});
