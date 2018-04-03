import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { csvParse } from 'd3-dsv';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

import { REGIONS } from './ranking-regions';
import { RankingLocation } from './ranking-location';

export class RankingEvictor {
  plaintiff: string;
  placeId?: string; // optional for now, not in the mock data
  placeName: string;
  renterHomes: number;
  filings: number;
  evictions: number;
  evictionRate: number;
  filingRate: number;
}

@Injectable()
export class RankingService {
  year = environment.rankingsYear;
  regions: Object = REGIONS;
  regionList: Array<string> = Object.keys(REGIONS);
  sortProps = [
    { value: 'evictionRate', langKey: 'STATS.JUDGMENT_RATE' },
    { value: 'evictions', langKey: 'STATS.JUDGMENTS' }
  ];
  areaTypes = [
    { value: 0, langKey: 'RANKINGS.CITIES' },
    { value: 1, langKey: 'RANKINGS.MID_SIZED_AREAS' },
    { value: 2, langKey: 'RANKINGS.RURAL_AREAS' }
  ];
  evictions: Array<RankingLocation>;
  stateData: Array<RankingLocation>;
  evictors: Array<RankingEvictor>;
  get isReady() { return this.ready.asObservable(); }
  private ready = new BehaviorSubject<boolean>(false);
  private _debug = true;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    @Inject('config') private config: any
  ) {
    this.translate.onLangChange.subscribe(lang => {
      this.debug('lang change', lang);
      this.updateLanguage(lang.translations);
    });
  }

  /**
   * Loads the CSV from the url provided in the module configuration
   * and passes it to the CSV parser
   */
  loadEvictionsData() {
    if (this.evictions) { this.setReady(true); return; }
    this.loadStateData();
    return this.http.get(this.config.cityUrl, { responseType: 'text' })
      .map((csvString) => {
        const parsedCsv = this.parseEvictionsData(csvString);
        return parsedCsv;
      })
      .subscribe(locations => {
        this.evictions = locations;
        this.setReady(true);
        this.translate.getTranslation(this.translate.currentLang).take(1)
          .subscribe(translations => this.updateLanguage(translations));
      });
  }

  /**
   * Loads the CSV from the url provided in the module configuration
   * and passes it to the CSV parser
   */
  loadEvictorsData() {
    if (this.evictors) { this.setReady(true); return; }
    return this.http.get(this.config.evictorsUrl, { responseType: 'text' })
      .map((csvString) => {
        const parsedCsv = this.parseEvictorsData(csvString);
        return parsedCsv;
      })
      .subscribe(locations => {
        this.evictors = locations;
        this.setReady(true);
        this.translate.getTranslation(this.translate.currentLang).take(1)
          .subscribe(translations => this.updateLanguage(translations));
      });
  }

  /** Loads state data that is used for social share */
  loadStateData() {
    return this.http.get(this.config.stateUrl, { responseType: 'text' })
      .map((csvString) => this.parseEvictionsData(csvString))
      .subscribe(locations => this.stateData = locations);
  }

  /** Set the ready status for the service */
  setReady(isReady: boolean) {
    this.ready.next(isReady);
  }

  /**
   * Sorts and returns the full dataset by sortProperty
   * @param sortProperty
   * @param invert
   */
  getSortedEvictions(sortProperty: string, invert?: boolean): Array<RankingLocation> {
    return this.evictions.sort(this.getComparator(sortProperty, invert));
  }

  /**
   * Sorts and returns the full dataset by sortProperty
   * @param sortProperty
   * @param invert
   */
  getSortedEvictors(sortProperty: string, invert?: boolean): Array<RankingEvictor> {
    return this.evictors.sort(this.getComparator(sortProperty, invert));
  }


  /**
   * Filters, sorts and returns an array of locations based on the provided params
   * @param region the state name to get data for, or 'United States' for all states
   * @param areaType the area type to get data for (rural, mid-sized, cities)
   * @param sortProperty the property to sort the data by
   */
  getFilteredEvictions(
    region: string, areaType: number, sortProperty: string, invert?: boolean
  ): Array<RankingLocation> {
    let data = region !== 'United States' ?
      this.evictions.filter(l => l.parentLocation === region && l.areaType === areaType) :
      this.evictions.filter(l => l.areaType === areaType);
    data = data.sort(this.getComparator(sortProperty, invert))
      .map((d) => this.handleNaN(d, sortProperty));
    return data;
  }

  /**
   * Filters, sorts and returns an array of locations based on the provided params
   * @param place the state name to get data for, or 'United States' for all states
   * @param sortProperty the property to sort the data by
   */
  getFilteredEvictors(
    place: string, sortProperty: string, invert?: boolean
  ): Array<RankingEvictor> {
    let data = place ?
      this.evictors.filter(l => l.placeName === place) : this.evictors;
    data = data.sort(this.getComparator(sortProperty, invert));
    return data;
  }

  /**
   * Parses CSV data and maps it to an array of RankingLocation objects
   * @param csv csv data as a string
   */
  parseEvictionsData(csv: string): Array<RankingLocation> {
    return csvParse(csv, (d) => {
      return {
        geoId: d.GEOID,
        evictions: parseFloat(d.evictions),
        evictionRate: parseFloat(d['eviction-rate']),
        name: d['name'],
        displayName: `${d['name']}, ${this.regions[d['parent-location']]}`,
        parentLocation: d['parent-location'],
        displayParentLocation: d['parent-location'] === 'USA' ?
          'USA' : this.regions[d['parent-location']],
        latLon: [ parseFloat(d.lat), parseFloat(d.lon) ],
        areaType: d['area-type'] ? parseInt(d['area-type'], 10) : 3
      } as RankingLocation;
    });
  }

  /**
   * Parses CSV data and maps it to an array of RankingLocation objects
   * @param csv csv data as a string
   */
  parseEvictorsData(csv: string): Array<RankingEvictor> {
    return csvParse(csv, (d) => {
      return {
        plaintiff: d['Plaintiff'],
        placeName: d['Place'],
        renterHomes: parseInt(d['Renting Households'], 10),
        filings: parseInt(d['Filings'], 10),
        evictions: parseInt(d['Evictions'], 10),
        evictionRate: parseFloat(d['Eviction Rate']),
        filingRate: parseFloat(d['Filing Rate'])
      } as RankingEvictor;
    });
  }

  /**
   * Returns ordinal suffix for rank
   * @param rank
   */
  ordinalSuffix(rank: number): string {
    const digit = rank % 10;
    if (this.translate.currentLang === 'en') {
      if (rank >= 10 && rank <= 20) {
        return 'th';
      }
      switch (digit) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    } else if (this.translate.currentLang === 'es') {
      // Spanish depends on gender of word being described
      // TODO: Check if this is right
      return 'a';
    }
    // Default to empty string
    return '';
  }

  private handleNaN(dataItem, dataProp) {
    if (isNaN(dataItem[dataProp])) {
      dataItem[dataProp] = -1;
    }
    return dataItem;
  }

  /** Creates a function to use for sorting the data */
  private getComparator(prop, invert?: boolean) {
    return (a, b) => {
      const item1 = invert ? a : b;
      const item2 = invert ? b : a;
      if (!(prop in item1) || isNaN(item1[prop])) { return -1; }
      if (!(prop in item2) || isNaN(item2[prop])) { return 1; }
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

  private debug(...args) {
    // tslint:disable-next-line
    environment.production || !this._debug ? null : console.debug.apply(console, [ 'rankings: ', ...args]);
  }
}
