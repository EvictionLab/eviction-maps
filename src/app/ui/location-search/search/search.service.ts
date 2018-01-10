import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchSource, MapboxSource } from './search-sources';
import { MapFeature } from '../../../map-tool/map/map-feature';
import { csvParse } from 'd3-dsv';

@Injectable()
export class SearchService {
  source: SearchSource = MapboxSource;
  query: string;
  results: Observable<Object[]>;

  constructor(private http: HttpClient) {
    if (this.source.hasOwnProperty('csvUrl')) {
      this.http.get(this.source.csvUrl, { responseType: 'text' })
        .map(csvStr => this.parseCsv(csvStr))
        .subscribe(features => { this.source.featureList = features; });
    }
    this.results = Observable.create((observer: any) => {
      this.queryGeocoder(this.query)
        .subscribe((results: Object[]) => {
          observer.next(results);
        });
    });
  }

  /**
   * Queries geocoder and returns an observable with results
   * @param query string to be sent to API
   */
  queryGeocoder(query: string): Observable<Object[]> {
    return this.http.get(this.source.query(query))
      .map(res => this.source.results(res, query));
  }

  /**
   * Parse CSV from source
   * @param csv
   */
  private parseCsv(csv: string): MapFeature[] {
    const layerId = this.source.csvUrl.split('/').slice(-1)[0].split('.')[0];
    return csvParse(csv, d => {
      return {
        type: 'Feature',
        bbox: [ +d.west, +d.south, +d.east, +d.north ],
        properties: { label: d.name, layerId: layerId, GEOID: d.GEOID },
        geometry: { type: 'Point',  coordinates: [+d.lon, +d.lat] }
      } as MapFeature;
    });
  }
}
