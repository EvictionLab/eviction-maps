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

@Component({
  selector: 'app-graph-embed',
  templateUrl: './graph-embed.component.html',
  styleUrls: ['./graph-embed.component.scss'],
  providers: [ GraphService ]
})
export class GraphEmbedComponent implements OnInit, OnDestroy {
  id = 'embed-graph';
  type = 'line';
  items: Array<GraphItem> = [];
  data;
  settings;
  properties: Array<string> = [];
  places: Array<string> = [];
  startYear = 2000;
  endYear = 2016;
  tooltips = [];
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
  }

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
    if (params['items']) { this.updateGraph(params['items']); }
    if (params['lang'] && params['lang'] !== this.translate.currentLang) {
      this.translate.use(params['lang']);
    }
  }

  /** Updates the graph based on item query parameters */
  private updateGraph(items) {
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
   * ?items=nationwide|er+56,-107.562,43.004|er
   * @param param
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
