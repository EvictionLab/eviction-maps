import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const MapzenLayerMap = {
  'region': 'states',
  'county': 'counties',
  'locality': 'cities',
  'localadmin': 'cities',
  'postalcode': 'zip-codes'
};

@Injectable()
export class SearchService {
  apiKey = 'mapzen-FgUaZ97';
  mapzenParams = [
    'sources=whosonfirst,openstreetmap',
    'layers=address,localadmin,locality,county,region,postalcode',
    'boundary.country=USA',
    'api_key=' + this.apiKey
  ];
  mapzenBase = 'https://search.mapzen.com/v1/autocomplete?';
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
   * Queries Mapzen geocoder and returns an observable with results
   * @param query string to be sent to Mapzen API
   */
  queryGeocoder(query: string): Observable<Object[]> {
    return this.http.get(`${this.mapzenBase}text=${query}&${this.mapzenParams.join('&')}`)
      .map(res => res['features']);
  }

  /**
   * Accepts a Mapzen layer string, returns the name of the tile layer to query
   * @param layerStr Mapzen layer name
   */
  getLayerName(layerStr: string) {
    return MapzenLayerMap.hasOwnProperty(layerStr) ? MapzenLayerMap[layerStr] : 'block-groups';
  }

}
