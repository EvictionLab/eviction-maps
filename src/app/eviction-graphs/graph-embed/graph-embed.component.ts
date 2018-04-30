import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { GraphService, GraphItem } from '../graph.service';
import { MapFeature } from '../../map-tool/map/map-feature';
import { SSL_OP_COOKIE_EXCHANGE } from 'constants';

@Component({
  selector: 'app-graph-embed',
  templateUrl: './graph-embed.component.html',
  styleUrls: ['./graph-embed.component.scss'],
  providers: [ GraphService ]
})
export class GraphEmbedComponent implements OnInit, OnDestroy {
  id = 'embed-graph';
  /** Type of graph to show (line only for now) */
  type = 'line';
  /** Graph items that are displayed on the graph */
  items: Array<GraphItem> = [];
  /** Data that is passed to the graph component */
  data;
  /** Graph config that is passed to the graph component */
  settings;
  /** An array of all of the data properties that are on the graph */
  properties: Array<string> = [];
  /** An array of all the places on the graph */
  places: Array<string> = [];
  /** Start year for the graph */
  startYear = 2000;
  /** End year for the graph */
  endYear = 2016;
  /** An array of values to show tooltips for */
  tooltips = [];
  /** the query param value of items */
  private itemsStr: string;
  private destroy = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private translatePipe: TranslatePipe,
    private graphService: GraphService,
    private cd: ChangeDetectorRef
  ) { }

  /** Listen for when the data is ready and for route changes */
  ngOnInit() {
    this.graphService.ready
      .switchMap(r => this.route.queryParams)
      .takeUntil(this.destroy)
      .subscribe(this.onQueryParamChange.bind(this));
    this.translate.onLangChange
      .takeUntil(this.destroy)
      .subscribe(lang => {
        if (this.itemsStr) { this.updateGraph(this.itemsStr); }
      });
  }

  /** Takes an array and returns a human readable list */
  humanizeArray(a) {
    return a.length === 2 ?
      this.translatePipe.transform('DATA.LIST_TWO', {
        firstItem: a[0],
        lastItem: a[1]
      }) :
      this.translatePipe.transform('DATA.LIST_MANY', {
        firstItems: a.slice(0, a.length - 1).join(', '),
        lastItem: a[a.length - 1]
      });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }

  /** Sets the tooltip data when the graph is hovered */
  updateTooltips(data) {
    this.tooltips = data ? data : [];
  }

  /** Gets the Y axis label for the graph, no label if more than one property */
  private getLabelY() {
    return this.properties.length === 1 ? { label: this.properties[0] } : {};
  }

  /** Formats percents and floats and all others as abbreviated */
  private getTickFormatY() {
    const formats = Array.from(new Set(this.items.map(d => d.prop['format'])));
    return formats.length === 1 && formats[0] === 'percent' ? '.0f' : '.0s';
  }

  /** Creats the graph based on query parameters */
  private onQueryParamChange(params) {
    if (params['lang'] && params['lang'] !== this.translate.currentLang) {
      this.translate.use(params['lang']);
    }
    if (params['items']) {
      this.itemsStr = params['items'];
      this.updateGraph(params['items']);
    }
  }

  /** Updates the graph based on item query parameters */
  private updateGraph(items: string) {
    this.getGraphData(items).subscribe(data => {
      this.items = data;
      this.data = this.graphService.createLineGraphData(data, this.startYear, this.endYear);
      this.properties = Array.from(new Set(data.map(d => d.prop['name'])));
      this.places = Array.from(new Set(data.map(d => d.name)));
      this.settings = this.getGraphSettings(this.startYear, this.endYear);
      this.cd.detectChanges();
    });
  }

  /**
   * Processes the `items` query param, and fetches graph items for the
   * provided locations.
   * @param param string with the locations (e.g. `nationwide|er+56,-107.562,43.004|er`)
   */
  private getGraphData(param: string) {
    const items = param.split('+');
    const itemData = items.map(item => {
      const [ location, prop ] = item.split('|');
      if (location === 'nationwide') {
        return this.graphService.getNationalGraphItem(prop);
      }
      if (location.split(',').length === 3) {
        const [ geoid, lon, lat ] = location.split(',');
        const lonLat = [ parseFloat(lon), parseFloat(lat) ];
        return this.graphService.getLocationGraphItem(geoid, lonLat, prop);
      }
      return null;
    }).filter(i => !!i);
    return Observable.forkJoin(itemData);
  }

  /** Returns the settings for the graph */
  private getGraphSettings(startYear: number, endYear: number) {
    const xAxis = this.graphService.getAxis(
      { ticks: Math.min(5, endYear - startYear) }
    );
    const yAxis = this.graphService.getAxis(
      { tickSize: '-100%', tickPadding: 5, tickFormat: this.getTickFormatY(), ...this.getLabelY() }
    );
    return {
      axis: { x: xAxis, y: yAxis },
      margin: { left: 64, right: 64, bottom: 48, top: 24 }
    };
  }

}
