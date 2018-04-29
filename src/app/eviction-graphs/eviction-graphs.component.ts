import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { MapDataAttribute } from '../map-tool/data/map-data-attribute';
import { GraphService, GraphItem } from './graph.service';
import { MapFeature } from '../map-tool/map/map-feature';

@Component({
  selector: 'app-eviction-graphs',
  templateUrl: './eviction-graphs.component.html',
  styleUrls: ['./eviction-graphs.component.scss'],
  providers: [ GraphService ]
})
export class EvictionGraphsComponent implements OnInit {

  @Input() dataAttributes: MapDataAttribute[] = [];

  /** Bar graph year input / output (allows double binding) */
  private _barYear;
  @Input() set barYear(value: number) {
    if (value !== this._barYear) {
      this._barYear = value;
      this.barYearChange.emit(this._barYear);
      if (this.graphType === 'bar') {
        this.setGraphData();
      }
    }
  }
  get barYear() { return this._barYear; }
  @Output() barYearChange = new EventEmitter();

  /** The `MapDataAttribute` to show on the graph */
  private _graphAttribute = { id: '', langKey: ''};
  @Input() set graphAttribute(attr: MapDataAttribute) {
    if (!attr || !this._graphAttribute || attr.id === this._graphAttribute.id) { return; }
    this._graphAttribute = attr;
    this.graphAttributeChange.emit(this._graphAttribute);
    this.graphService.getNationalGraphItem(this.graphAttribute.id)
      .takeUntil(this.graphAttributeChange)
      .subscribe(data => {
        this.average = data;
        this.setGraphData();
      });
  }
  get graphAttribute(): MapDataAttribute {
    return this._graphAttribute.id === 'none' ? this.dataAttributes[0] : this._graphAttribute;
  }
  @Output() graphAttributeChange = new EventEmitter();

  /** Line graph year start input / output (allows double binding) */
  private _lineStartYear;
  @Input() set lineStartYear(value: number) {
    if (value !== this._lineStartYear) {
      this._lineStartYear = value;
      this.lineStartYearChange.emit(this._lineStartYear);
      this.startSelect = this.graphService.generateYearArray(this.minYear, this.lineEndYear - 1);
      this.endSelect = this.graphService.generateYearArray(this.lineStartYear + 1, this.maxYear);
      if (this.graphType === 'line') {
        this.setGraphData();
      }
    }
  }
  get lineStartYear() { return this._lineStartYear; }
  @Output() lineStartYearChange = new EventEmitter();

  /** Line graph year end input / output (allows double binding) */
  private _lineEndYear;
  @Input() set lineEndYear(value: number) {
    if (value !== this._lineEndYear) {
      this._lineEndYear = value;
      this.lineEndYearChange.emit(this._lineEndYear);
      this.startSelect = this.graphService.generateYearArray(this.minYear, this.lineEndYear - 1);
      this.endSelect = this.graphService.generateYearArray(this.lineStartYear + 1, this.maxYear);
      if (this.graphType === 'line') {
        this.setGraphData();
      }
    }
  }
  get lineEndYear() { return this._lineEndYear; }
  @Output() lineEndYearChange = new EventEmitter();

  /** Locations to show on the graph */
  private _locations = [];
  @Input() set locations(value) {
    this._locations = value;
    this.setGraphData();
  }
  get locations() { return this._locations ? this._locations.filter(l => l) : []; }
  @Output() locationRemoved = new EventEmitter();

  /** Graph type input and output (allows double binding) */
  private _graphType = 'line';
  @Input() set graphType(type: string) {
    if (this._graphType !== type) {
      this._graphType = type;
      this.tooltips = [];
      this.graphTypeChange.emit(type);
      this.setGraphData();
    }
  }
  get graphType() { return this._graphType; }
  @Output() graphTypeChange = new EventEmitter();

  /** Tracks if average is shown */
  private _showAverage = true;
  @Input() set showAverage(value: boolean) {
    if (value !== this.showAverage) {
      this._showAverage = value;
      this.showAverageChange.emit(value);
      this.setGraphData();
      this.toggleAverageClass();
    }
  }
  get showAverage() { return this._showAverage; }
  @Output() showAverageChange = new EventEmitter();

  /** Graph items currently shown on the graph */
  get graphItems(): Array<GraphItem> {
    const locationGraphItems = this.locations
      .map(f => this.graphService.featureToGraphItem(f, this.graphAttribute));
    return this.showAverage && this.average ?
      [ ...locationGraphItems, this.average ] : locationGraphItems;
  }

  /** tracks if the average is active on the graph */
  averageActive = true;
  /** attribute for holding tooltip data */
  tooltips = [];
  /** attribute w/ object of graph options */
  graphTypeOptions = this.createGraphTypeOptions();
  /** graph data that is passed to the graph component */
  graphData;
  /** attribute for passing graph settings to graph component */
  graphSettings;
  /** array of years for the "start year" select for line graph */
  startSelect: Array<number>;
  /** array of years for the "end year" select for line graph */
  endSelect: Array<number>;
  /** minimum allowed year for year selects */
  minYear = environment.minYear;
  /** maximum allowed year for year selects */
  maxYear = environment.maxYear;
  /** array of years for bar graph select */
  barYearSelect: Array<number>;
  /** event emitter for when user hovers the graph */
  graphHover = new EventEmitter();
  /** tracks if a timeout is set to update graph settings */
  private graphTimeout;
  /** tracks timeout when setting average so it can be cancelled */
  private averageTimeout;
  /** Graph item for the national average */
  private average: GraphItem;

  constructor(
    private translatePipe: TranslatePipe,
    private translate: TranslateService,
    private cd: ChangeDetectorRef,
    private graphService: GraphService
  ) { }

  ngOnInit() {
    // national average graph item
    this.graphService.getNationalGraphItem(this.graphAttribute.id)
      .takeUntil(this.graphAttributeChange)
      .subscribe(data => {
        this.average = data;
        this.setGraphData();
      });
    this.barYearSelect = this.graphService.generateYearArray(this.minYear, this.maxYear);
    // Update graph axis settings on language change
    this.translate.onLangChange.subscribe(() => {
      this.graphSettings = this.graphType === 'bar' ?
        this.getBarGraphConfig() : this.getLineGraphConfig();
      this.graphTypeOptions = this.createGraphTypeOptions();
    });
    this.graphHover.debounceTime(10).subscribe(e => this.onGraphHover(e));
    this.cd.detectChanges();
  }

  /** Get the current graph attribute with year */
  attrYear(year: number) {
    return this.graphAttribute.id + '-' + year.toString().slice(-2);
  }

  /**
   * Sets the tooltip data on graph hover, or empty array if none
   * @param hoverItems the currently hovered item(s)
   */
  onGraphHover(hoverItems) {
    this.tooltips = hoverItems ?
      (this.graphType === 'bar' ? [ hoverItems ] : hoverItems) :
      [];
  }

  /** Generates text for the value label under the location in the legend */
  getLegendValue(location, locationIndex: number): string {
    if (!location) { return ''; }
    // average is GraphItem so use `data` if `properties` is not available
    const l = location.properties || location.data;
    if (this.graphType === 'bar') {
      const value = l[this.attrYear(this.barYear)];
      return value >= 0 ?
        this.barYear + ': ' + this.formatValue(value, this.graphAttribute.format) :
        this.translatePipe.transform('DATA.UNAVAILABLE');
    } else if (this.graphType === 'line') {
      const tooltip = this.tooltips[locationIndex];
      if (!tooltip) { return ''; }
      const value = l[this.attrYear(tooltip.x)];
      return value >= 0 ?
        tooltip.x + ': ' + this.formatValue(value, this.graphAttribute.format) :
        this.translatePipe.transform('DATA.UNAVAILABLE');
    }
    return '';
  }

  /** Formats the value with the provided format */
  formatValue(value, format: string) {
    if (format === 'percent') { return value + '%'; }
    return value;
  }

  /**
   * Toggles the graph between judgments / filings
   */
  changeGraphProperty(filings: boolean) {
    const attr = filings ? this.dataAttributes[1] : this.dataAttributes[0];
    this.graphAttribute = attr;
  }

  /** Gets config for bar graph */
  getBarGraphConfig() {
    return {
      title: this.translatePipe.transform('DATA.BAR_GRAPH_TITLE', {
        type: this.graphAttribute.name,
        locations: this.locations
          .map(l => l.properties.n).join(', '),
        year: this.barYear
      }),
      description: this.translatePipe.transform('DATA.BAR_GRAPH_DESC', {
        type: this.graphAttribute.name,
        locations: this.locations
          .map(l => `${l.properties.n} (${l.properties[this.attrYear(this.barYear)]})`)
          .join(', '),
        year: this.barYear
      }),
      axis: {
        x: { label: null, tickFormat: '.0f' },
        y: {
          label: this.getAxisLabel(),
          tickSize: '-100%',
          ticks: 5,
          tickPadding: 5,
          maxVal: 100
        }
      },
      margin: { left: 65, right: 16, bottom: 32, top: 16 }
    };
  }

  /** Gets config for line graph */
  getLineGraphConfig() {
    return {
      title: this.translatePipe.transform('DATA.LINE_GRAPH_TITLE', {
        type: this.graphAttribute.name,
        locations: this.locations.map(l => l.properties.n).join(', '),
        year1: this.lineStartYear,
        year2: this.lineEndYear
      }),
      description: this.translatePipe.transform('DATA.LINE_GRAPH_DESC', {
        type: this.graphAttribute.name
      }),
      axis: {
        x: {
          label: null,
          tickFormat: '.0f',
          ticks: Math.min(5, this.lineEndYear - this.lineStartYear),
          tickPadding: 10
        },
        y: {
          label: this.getAxisLabel(),
          tickSize: '-100%',
          ticks: 5,
          tickPadding: 5,
          maxVal: 100
        }
      },
      margin: { left: 65, right: 16, bottom: 48, top: 16 }
    };
  }


  /**
   * Sets the data for the graph, and any settings specific to the type
   */
  setGraphData() {
    if (!this.locations || this.locations.length === 0) { return; }
    this.tooltips = [];
    if (this.graphType === 'line') {
      this.graphSettings = this.getLineGraphConfig();
      this.graphData = [...this.createLineGraphData()];
    } else {
      this.graphSettings = this.getBarGraphConfig();
      this.graphData = [...this.createBarGraphData()];
    }
    this.setGraphSettings();
  }

  /**
   * Sets the settings for the graph
   * WARNING: something with the dimensions is not set correctly when updating settings
   *  delaying the update in a timeout seems to fix the issue.
   */
  setGraphSettings() {
    if (this.graphTimeout) { clearTimeout(this.graphTimeout); } // clear timeout if one is set
    this.graphTimeout = setTimeout(() => {
      const settings = this.graphType === 'line' ?
        this.getLineGraphConfig() : this.getBarGraphConfig();
      this.graphSettings = { ...settings };
      this.graphTimeout = null;
    }, 1250);
  }

  /** Returns the Y axis label name with % added if they are percent values */
  private getAxisLabel() {
    return this.graphAttribute.name +
      (this.graphAttribute.format === 'percent' ? ' (%)' : '');
  }

  /**
   * toggle `averageActive` after a timeout if false so line/bar doesn't
   * immediately change color
   */
  private toggleAverageClass() {
    if (this.showAverage) {
      if (this.averageTimeout) { clearTimeout(this.averageTimeout); }
      this.averageActive = true;
    } else {
      this.averageTimeout = setTimeout(() => {
        this.averageActive = false;
        this.averageTimeout = null;
      }, 1000);
    }
  }

  /** Get the features to show on the graph */
  private getGraphFeatures() {
    return this.showAverage && this.average ?
      [...this.locations, this.average] : this.locations;
  }

  /**
   * Generates line graph data from the features in `locations`
   */
  private createLineGraphData() {
    return this.graphService
      .createLineGraphData(this.graphItems, this.lineStartYear, this.lineEndYear);
  }

  /**
   * Generate bar graph data from the features
   */
  private createBarGraphData() {
    return this.graphService.createBarGraphData(this.graphItems, this.barYear);
  }

  private createGraphTypeOptions() {
    return [
      { value: 'bar', label: this.translatePipe.transform('DATA.GRAPH_BAR_LABEL') },
      { value: 'line', label: this.translatePipe.transform('DATA.GRAPH_LINE_LABEL')}
    ];
  }
}
