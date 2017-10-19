import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response, ResponseContentType } from '@angular/http';
import { MapFeature } from '../map/map-feature';
import * as SphericalMercator from '@mapbox/sphericalmercator';
import * as vt from '@mapbox/vector-tile';
import * as Protobuf from 'pbf';
import * as inside from '@turf/inside';
import * as bbox from '@turf/bbox';
import 'rxjs/add/observable/forkJoin';

const MapzenLayerMap = {
  'region': 'states',
  'county': 'counties',
  'locality': 'cities',
  'localadmin': 'cities',
  'postalcode': 'zip-codes'
};

@Injectable()
export class SearchService {
  tilesetYears = ['90', '00', '10'];
  apiKey = 'mapzen-FgUaZ97';
  mapzenParams = [
    'sources=whosonfirst',
    'layers=localadmin,locality,county,region,postalcode',
    'boundary.country=USA',
    'api_key=' + this.apiKey
  ];
  mapzenBase = 'https://search.mapzen.com/v1/autocomplete?';
  tileBase = 'https://s3.us-east-2.amazonaws.com/eviction-lab-tilesets/fixtures/';
  maxZoom = 10;
  mercator = new SphericalMercator({ size: 256 });
  query: string;
  private _results = new BehaviorSubject<Object[]>([]);
  results: Observable<Object[]>;

  constructor(private http: Http) {
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
      .map(res => res.json().features);
  }

  /**
   * Accepts a Mapzen layer string, returns the name of the tile layer to query
   * @param layerStr Mapzen layer name
   */
  getLayerName(layerStr: string) {
    return MapzenLayerMap.hasOwnProperty(layerStr) ? MapzenLayerMap[layerStr] : 'block-groups';
  }

  /**
   * Takes the layer to be queried and coordinates for an object,
   * determines which tile to request, parses it, and then returns
   * the first feature that the includes the coordinate point
   *
   * @param layerId ID of layer to query for tile data
   * @param lonLat array of [lon, lat]
   * @param multiYear specifies whether to merge multiple year tiles
   */
  getTileData(layerId: string, lonLat: number[], multiYear = false): Observable<MapFeature> {
    const point = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: lonLat },
      properties: {}
    } as GeoJSON.Feature<GeoJSON.Point>;
    const xyzCoords = this.mercator.xyz([lonLat[0], lonLat[1], lonLat[0], lonLat[1]]);
    const coords = { x: xyzCoords.maxX, y: xyzCoords.maxY };

    // Defining function block to retain scope
    const parseTile = (res: Response): MapFeature => {
      const tile = new vt.VectorTile(new Protobuf(res.arrayBuffer()));
      const layer = tile.layers[layerId];
      for (let i = 0; i < layer.length; ++i) {
        const feat = layer.feature(i).toGeoJSON(coords.x, coords.y, this.maxZoom);
        if (inside(point, feat)) {
          feat.properties.bbox = bbox(feat);
          return feat;
        }
      }
      // Return empty object if nothing found for now
      return {} as MapFeature;
    };

    if (multiYear) {
      const tileRequests = this.tilesetYears.map((y) => {
        return this.http.get(
          `${this.tileBase}evictions-${layerId}-${y}/` +
          `${this.maxZoom}/${coords['x']}/${coords['y']}.pbf`,
          { responseType: ResponseContentType.ArrayBuffer }
        ).map(parseTile);
      });

      return Observable.forkJoin(tileRequests)
        .map((features: any[]) => {
          const feat = features[0];
          for (let i = 1; i < this.tilesetYears.length; ++i) {
            feat['properties'] = { ...feat['properties'], ...features[i]['properties']};
          }
          return feat as MapFeature;
        });
    } else {
      return this.http.get(
        `${this.tileBase}evictions-${layerId}/${this.maxZoom}/${coords.x}/${coords.y}.pbf`,
        { responseType: ResponseContentType.ArrayBuffer }
      ).map(parseTile);
    }
  }

}
