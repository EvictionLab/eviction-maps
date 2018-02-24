import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { csvParse } from 'd3-dsv';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';

import { REGIONS } from './ranking-regions';
import { RankingLocation } from './ranking-location';

@Injectable()
export class RankingService {
  year = 2016;
  regions: Object = REGIONS;
  regionList: Array<string> = Object.keys(REGIONS);
  sortProps = [
    { value: 'evictionRate', langKey: 'STATS.JUDGMENT_RATE' },
    { value: 'evictions', langKey: 'STATS.JUDGMENTS' },
    { value: 'filingRate', langKey: 'STATS.FILING_RATE' },
    { value: 'filings', langKey: 'STATS.FILINGS'}
  ];
  areaTypes = [
    { value: 0, langKey: 'RANKINGS.CITIES' },
    { value: 1, langKey: 'RANKINGS.MID_SIZED_AREAS' },
    { value: 2, langKey: 'RANKINGS.RURAL_AREAS' }
  ];
  data: Array<RankingLocation>;
  get isReady() { return this.ready.asObservable(); }
  private ready = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    @Inject('config') private config: any
  ) {
    this.updateLanguage(this.translate.translations[this.translate.currentLang]);
    this.translate.onLangChange.subscribe(lang => {
      console.log('lang change', lang);
      this.updateLanguage(lang.translations);
    });
    this.loadCsvData();
  }

  /**
   * Loads the CSV from the url provided in the module configuration
   * and passes it to the CSV parser
   */
  loadCsvData() {
    console.time('load rankings');
    return this.http.get(this.config.dataUrl, { responseType: 'text' })
      .map((csvString) => {
        console.timeEnd('load rankings');
        console.time('parse csv');
        const parsedCsv = this.parseCsvData(csvString);
        console.timeEnd('parse csv');
        return parsedCsv;
      })
      .subscribe(locations => {
        this.data = locations;
        this.ready.next(true);
      });
  }

  /**
   * Sorts and returns the full dataset by sortProperty
   * @param sortProperty
   * @param invert
   */
  getSortedData(sortProperty: string, invert?: boolean): Array<RankingLocation> {
    return this.data.sort(this.getComparator(sortProperty, invert));
  }

  /**
   * Filters, sorts and returns an array of locations based on the provided params
   * @param region the state name to get data for, or 'United States' for all states
   * @param areaType the area type to get data for (rural, mid-sized, cities)
   * @param sortProperty the property to sort the data by
   */
  getFilteredData(
    region: string, areaType: number, sortProperty: string, invert?: boolean
  ): Array<RankingLocation> {
    console.time('sort rankings');
    let data = region !== 'United States' ?
      this.data.filter(l => l.parentLocation === region && l.areaType === areaType) :
      this.data.filter(l => l.areaType === areaType);
    data = data.sort(this.getComparator(sortProperty, invert));
    console.timeEnd('sort rankings');
    return data;
  }

  /**
   * Parses CSV data and maps it to an array of RankingLocation objects
   * @param csv csv data as a string
   */
  parseCsvData(csv: string): Array<RankingLocation> {
    return csvParse(csv, (d) => {
      return {
        geoId: d.GEOID,
        evictions: parseFloat(d.evictions),
        filings: parseFloat(d['eviction-filings']),
        evictionRate: parseFloat(d['eviction-rate']),
        filingRate: parseFloat(d['eviction-filing-rate']),
        name: d['name'],
        displayName: `${d['name']}, ${this.regions[d['parent-location']]}`,
        parentLocation: d['parent-location'],
        displayParentLocation: this.regions[d['parent-location']],
        latLon: [ parseFloat(d.lat), parseFloat(d.lon) ],
        areaType: parseInt(d['area-type'], 10)
      } as RankingLocation;
    });
  }

  /** Creates a function to use for sorting the data */
  private getComparator(prop, invert?: boolean) {
    return (a, b) => {
      const item1 = invert ? a : b;
      const item2 = invert ? b : a;
      if (!item1[prop] || isNaN(item1[prop])) { return -1; }
      if (!item2[prop] || isNaN(item2[prop])) { return 1; }
      return item1[prop] - item2[prop];
    };
  }

  private updateLanguage(translations) {
    if (translations.hasOwnProperty('STATS')) {
      const stats = translations['STATS'];
      this.sortProps = this.sortProps.map(p => {
        if (p.langKey) { p['name'] = stats[p.langKey.split('.')[1]]; }
        return p;
      });
    }
    if (translations.hasOwnProperty('RANKINGS')) {
      const rankings = translations['RANKINGS'];
      this.areaTypes = this.areaTypes.map(t => {
        if (t.langKey) { t['name'] = rankings[t.langKey.split('.')[1]]; }
        return t;
      });
    }
  }

}
