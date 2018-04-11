import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { csvParse } from 'd3-dsv';
import 'rxjs/add/operator/do';

import { SearchSource, MapboxSource, StaticSource } from './search-sources';
import { MapFeature } from '../map-tool/map/map-feature';
import { AnalyticsService } from './analytics.service';
import { environment } from '../../environments/environment';

@Injectable()
export class SearchService {
  source: SearchSource = environment.useMapbox ? MapboxSource : StaticSource;

  constructor(private http: HttpClient, private analytics: AnalyticsService) {
    if (this.source.hasOwnProperty('csvUrl')) {
      this.http.get(this.source.csvUrl, { responseType: 'text' })
        .map(csvStr => this.parseCsv(csvStr))
        .subscribe(features => { this.source.featureList = features; });
    }
  }

  /**
   * Queries geocoder and returns an observable with results, track if empty results
   * @param query string to be sent to API
   */
  queryGeocoder(query: string): Observable<Object[]> {
    if (environment.useMapbox) {
      return this.http.get(this.source.query(query))
        .map(res => this.source.results(res, query));
    } else {
      return Observable.from([this.source.results({}, query)]);
    }
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
        bbox: [+d.west, +d.south, +d.east, +d.north],
        properties: {
          label: d.name,
          layerId: 'layer' in d ? d.layer : layerId,
          GEOID: d.GEOID
        },
        geometry: { type: 'Point', coordinates: [+d.lon, +d.lat] }
      } as MapFeature;
    });
  }
}
