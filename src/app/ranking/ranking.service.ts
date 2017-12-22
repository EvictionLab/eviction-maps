import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { csvParse } from 'd3-dsv';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { REGIONS } from './ranking-regions';
import { RankingLocation } from './ranking-location';

@Injectable()
export class RankingService {
  regions: Array<string> = REGIONS;
  sortProps = [
    { value: 'evictionRate', name: 'Eviction Rate' },
    { value: 'evictions', name: 'Evictions' }
  ];
  areaTypes = [
    { value: 0, name: 'Cities' },
    { value: 1, name: 'Mid-sized Areas' },
    { value: 2, name: 'Rural Areas' }
  ];
  get isReady() { return this.ready.asObservable(); }
  private ready = new BehaviorSubject<boolean>(false);
  private data: Array<RankingLocation>;


  constructor(
    private http: HttpClient,
    @Inject('config') private config: any
  ) {
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
   * Sorts and returns an array of locations based on the provided params
   * @param region the state name to get data for, or 'United States' for all states
   * @param areaType the area type to get data for (rural, mid-sized, cities)
   * @param sortProperty the property to sort the data by
   */
  getSortedData(region: string, areaType: number, sortProperty: string, invert?: boolean): Array<RankingLocation> {
    console.time('sort rankings')
    let data = region !== 'United States' ?
      this.data.filter(l => l.parentLocation === region && l.areaType === areaType) :
      this.data.filter(l => l.areaType === areaType)
    data = invert ?
      data.sort((a, b) => a[sortProperty] - b[sortProperty]) :
      data.sort((a, b) => b[sortProperty] - a[sortProperty]);
    console.timeEnd('sort rankings');
    return data;
  }

  /**
   * Parses CSV data and maps it to an array of RankingLocation objects
   * @param csv csv data as a string
   */
  private parseCsvData(csv: string): Array<RankingLocation> {
    return csvParse(csv, (d) => {
      return {
        geoId: parseInt(d.GEOID),
        evictions: parseFloat(d.evictions),
        filings: parseFloat(d['eviction-filings']),
        evictionRate: parseFloat(d['eviction-rate']),
        filingRate: parseFloat(d['eviction-filing-rate']),
        name: d['name'],
        parentLocation: d['parent-location'],
        latLon: [ parseFloat(d.lat), parseFloat(d.lon) ],
        areaType: parseInt(d['area-type'])
      } as RankingLocation;
    });
  }

}
