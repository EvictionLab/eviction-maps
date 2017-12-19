import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { csvParse } from 'd3-dsv';
import { RankingLocation } from './ranking-location';

@Injectable()
export class RankingService {

  private data: Array<RankingLocation>;

  constructor(private http: HttpClient, @Inject('config') private config:any) { }

  /**
   * Loads the CSV from the url provided in the module configuration
   */
  loadCsvData() {
    return this.http.get(this.config.dataUrl, { responseType: 'text' })
      .map(csvString => { csvParse(csvString); });
  }

  /**
   * Sorts and returns an array of locations based on the provided params
   * @param region the state name to get data for, or null for all states
   * @param areaType the area type to get data for (rural, mid-sized, cities)
   * @param sortProperty the property to sort the data by
   */
  getSortedData(region: string, areaType: string, sortProperty: string): Array<RankingLocation> {
    return null;
  }

}
