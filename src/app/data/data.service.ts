import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response, ResponseContentType } from '@angular/http';
import { MapFeature } from '../map-tool/map/map-feature';
import * as SphericalMercator from '@mapbox/sphericalmercator';
import * as vt from '@mapbox/vector-tile';
import * as Protobuf from 'pbf';
import * as inside from '@turf/inside';
import * as bbox from '@turf/bbox';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class DataService {
  mercator = new SphericalMercator({ size: 256 });
  tileBase = 'https://s3.us-east-2.amazonaws.com/eviction-lab-tilesets/fixtures/';
  tilePrefix = 'evictions-';
  tilesetYears = ['90', '00', '10'];
  maxZoom = 10;
  constructor(private http: Http) { }

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
    const coords = this.getCoords(lonLat);
    const parseTile = this.getParser(layerId, lonLat);
    if (multiYear) {
      const tileRequests = this.tilesetYears.map((y) => {
        return this.requestTile(layerId, coords, y).map(parseTile);
      });
      return Observable.forkJoin(tileRequests).map(this.mergeFeatureProperties.bind(this));
    } else {
      return this.requestTile(layerId, coords).map(parseTile);
    }
  }

  /**
   * Get the X/Y coords based on lonLat
   * @param lonLat
   */
  getCoords(lonLat) {
    const xyzCoords = this.mercator.xyz([lonLat[0], lonLat[1], lonLat[0], lonLat[1]], 10);
    return { x: xyzCoords.maxX, y: xyzCoords.maxY };
  }

  /**
   * Returns a function to parse the tile response from the tile HTTP request
   * @param layerId
   * @param lonLat
   */
  private getParser(layerId, lonLat) {
    const point = this.getPoint(lonLat);
    const coords = this.getCoords(lonLat);
    return (res: Response): MapFeature => {
      const tile = new vt.VectorTile(new Protobuf(res.arrayBuffer()));
      const layer = tile.layers[layerId];
      for (let i = 0; i < layer.length; ++i) {
        const feat = layer.feature(i).toGeoJSON(coords.x, coords.y, 10);
        if (inside(point, feat)) {
          feat.properties.bbox = bbox(feat);
          return feat;
        }
      }
      // Return empty object if nothing found for now
      return {} as MapFeature;
    };
  }

  /**
   * Gets a GeoJSON feature for a point at the given `lonLat`
   * @param lonLat
   */
  private getPoint(lonLat): GeoJSON.Feature<GeoJSON.Point> {
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: lonLat },
      properties: {}
    } as GeoJSON.Feature<GeoJSON.Point>;
  }

  /**
   * Merges the properties in an array of features
   * @param features an array of features
   */
  private mergeFeatureProperties(features: any[]) {
    const feat = features[0];
    for (let i = 1; i < this.tilesetYears.length; ++i) {
      feat['properties'] = { ...feat['properties'], ...features[i]['properties']};
    }
    return feat as MapFeature;
  }

  /**
   * Requests a tile based on the provided layer, coordinates, and year
   * @param layerId
   * @param coords
   * @param year
   */
  private requestTile(layerId: string, coords: any, year = null) {
    const tilesetUrl = year ?
      this.tileBase + this.tilePrefix + layerId + '-' + year :
      this.tileBase + this.tilePrefix + layerId;
    return this.http.get(
      `${tilesetUrl}/${this.maxZoom}/${coords.x}/${coords.y}.pbf`,
      { responseType: ResponseContentType.ArrayBuffer }
    );
  }


}
