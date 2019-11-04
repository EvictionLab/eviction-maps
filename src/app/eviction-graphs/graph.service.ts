import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { environment } from '../../environments/environment';
import { PlatformService } from '../services/platform.service';
import { MapFeature } from '../map-tool/map/map-feature';
import { AnalyticsService } from '../services/analytics.service';
import { MapDataAttribute } from '../map-tool/data/map-data-attribute';
import { DataService } from '../services/data.service';

export class GraphItemData {
  [attr: string]: number;
}

export class GraphItem {
  name: string;
  prop: MapDataAttribute;
  data: any;
}

@Injectable()
export class GraphService {

  /** Graph service is ready when the data service is ready */
  get ready(): Observable<boolean> { return this.dataService.ready; }

  constructor(private dataService: DataService) {}

  /**
   * Creates an array with number values from `start` to `end`
   */
  generateYearArray(start: number, end: number): Array<number> {
    const arr = [];
    for (let i = start; i <= end; i++) { arr.push(i); }
    if (arr.length === 0) { arr.push(end); }
    return arr;
  }

  /**
   * Genrates line graph data from the features in `locations`
   */
  createLineGraphData(items: Array<GraphItem>, startYear: number, endYear: number) {
    return items.map((item, i) => {
      return {
        id: item.prop['id'] + '-' + i,
        data: this.generateLineData(item, startYear, endYear)
      };
    });
  }

  /**
   * Generate bar graph data from the features in `locations
   */
  createBarGraphData(items: Array<GraphItem>, year: number) {
    // console.log('createBarGraphData()');
    // console.log(items);
    return items.map((item, i) => {
      const yVal = (item.data[this.attrYear(item.prop['id'], year)]);
      const ciH = (item.data[this.ciHandle(item.prop.id, year, 'h')]);
      const ciL = (item.data[this.ciHandle(item.prop.id, year, 'l')]);
      return {
        id: 'item' + i,
        data: [{
          x: item.name,
          y: yVal ? yVal : 0,
          ciH: ciH ? ciH : 0, // Upper CI
          ciL: ciL ? ciL : 0 // Lower CI
        }]
      };
    });
  }

  /** Gets the data for a location and maps the data into a `GraphItem` */
  getLocationGraphItem(geoid, lonLat, prop): Observable<GraphItem> {
    return this.dataService.getTileData(geoid, lonLat, true)
      .map((data: MapFeature) => this.featureToGraphItem(data, prop));
  }

  /** Gets the data for the nation and maps it into a `GraphItem` */
  getNationalGraphItem(prop: string): Observable<GraphItem> {
    return this.dataService.getNationalData()
      .map(data => {
        return {
          'name': 'United States',
          'prop': this.dataService.getDataAttribute(prop),
          'data': data
        };
      });
  }

  /** Returns an axis configuation base on defaults */
  getAxis(axisConfig) {
    const defaultAxis = {
      label: '',
      ticks: 5,
      tickSize: 5,
      tickFormat: '.0f',
      tickPadding: 10,
      minVal: null,
      maxVal: null
    };
    return Object.assign(defaultAxis, axisConfig);
  }

  /**
   * Converts a feature to a graph item
   */
  featureToGraphItem(feature: MapFeature, prop: MapDataAttribute | string): GraphItem {
    if (typeof prop === 'string') { prop = this.dataService.getDataAttribute(prop); }
    return {
      name: (feature['properties']['n'] + ', ' + feature['properties']['pl']) as string,
      prop: prop,
      data: feature['properties']
    };
  }

  /**
   * Get the provided attribute with the two digit year
   */
  private attrYear(attr: string, year: number) {
    return attr + '-' + year.toString().slice(-2);
  }

  /**
   * Get the provided attribute with the two digit year
   */
  private ciHandle(attr: string, year: number, suffix: string) {
    return attr + suffix + '-' + year.toString().slice(-2);
  }

  /**
   * Generate points for the line
   */
  private generateLineData(item: GraphItem, startYear: number, endYear: number) {
    return this.generateYearArray(startYear, endYear)
      .map((year) => {
        const yVal = item.data[this.attrYear(item.prop['id'], year)];
        const ciH = (item.data[this.ciHandle(item.prop.id, year, 'h')]);
        const ciL = (item.data[this.ciHandle(item.prop.id, year, 'l')]);
        return {
          format: item.prop['format'],
          x: year,
          y: yVal !== -1 && yVal !== null ? yVal : undefined,
          ciH: ciH ? ciH : 0, // Upper CI
          ciL: ciL ? ciL : 0 // Lower CI
        };
      });
  }
}
