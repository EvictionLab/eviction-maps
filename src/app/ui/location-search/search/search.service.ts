import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchSource, MapzenSource } from './search-sources';

@Injectable()
export class SearchService {
  source: SearchSource = MapzenSource;
  query: string;
  results: Observable<Object[]>;

  constructor(private http: HttpClient) {
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
      .map(res => this.source.results(res));
  }

}
