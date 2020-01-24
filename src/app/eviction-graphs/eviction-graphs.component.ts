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

  private _dataAttributes: MapDataAttribute[] = [];
  @Input() set dataAttributes(value: MapDataAttribute[]) {
    if (!value) { return; }
    this._dataAttributes =
      value.filter(d => d.type === 'bubble' && d.id !== 'none');
  }
  get dataAttributes() { return this._dataAttributes; }

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
  private _graphAttribute = { id: 'none', langKey: ''};
  @Input() set graphAttribute(attr: MapDataAttribute) {
    if (!attr || !this._graphAttribute) { return; }
    if (attr.id === this._graphAttribute.id) { return; }
    this._graphAttribute = attr;
    if (this.graphAttribute) {
      this.graphAttributeChange.emit(this.graphAttribute);
      this.graphService.getNationalGraphItem(this.graphAttribute.id)
        .takeUntil(this.graphAttributeChange)
        .subscribe(data => {
          this.average = data;
          this.setGraphData();
        });
    }
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
      if (this.graphType === 'line') {
        this.setGraphData();
      }
    }
  }
  get lineStartYear() { return this._lineStartYear; }

  /** Line graph year end input / output (allows double binding) */
  private _lineEndYear;
  @Input() set lineEndYear(value: number) {
    if (value !== this._lineEndYear) {
      this._lineEndYear = value;
      if (this.graphType === 'line') {
        this.setGraphData();
      }
    }
  }
  get lineEndYear() { return this._lineEndYear; }


  @Output() lineYearsChange = new EventEmitter();

  /** Array of all available years  */
  get lineYears() { return this.graphService.generateYearArray(this.minYear, this.maxYear); }

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
    console.log('changing graphtype: ', type);
    if (this._graphType !== type) {
      this._graphType = type;
      this.tooltips = [];
      this.graphTypeChange.emit(type);
      this.setGraphData();
    }
  }
  get graphType() { return this._graphType; }
  @Output() graphTypeChange = new EventEmitter();

  /** Confidence interval input and output (allows double binding) */
  private _displayCI = true;
  @Input() set displayCI(val: boolean) {
    if (this._displayCI !== val) {
      this._displayCI = val;
      this.displayCIChange.emit(val);
      this.setGraphData();
    }
  }
  get displayCI() { return this._displayCI; }
  @Output() displayCIChange = new EventEmitter();

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
    if (!this.locations || !this.graphAttribute) { return; }
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
  /** minimum allowed year for year selects */
  minYear = environment.minYear;
  /** maximum allowed year for year selects */
  maxYear = environment.maxYear;
  /** array of years for bar graph select */
  barYearSelect: Array<number>;
  /** event emitter for when user hovers the graph */
  graphHover = new EventEmitter();
  /** Graph item for the national average */
  average: GraphItem;
  /** tracks if a timeout is set to update graph settings */
  private graphTimeout;
  /** tracks timeout when setting average so it can be cancelled */
  private averageTimeout;
  /** Options available for bubbles */
  bubbleOptions: MapDataAttribute[] = [];
  /** Graph type object container */
  graphTypeObject = this.getGraphTypeObject();

  constructor(
    private translatePipe: TranslatePipe,
    private translate: TranslateService,
    private cd: ChangeDetectorRef,
    private graphService: GraphService
  ) { }

  ngOnInit() {
    // national average graph item
    if (this.graphAttribute) {
      this.graphService.getNationalGraphItem(this.graphAttribute.id)
      .takeUntil(this.graphAttributeChange)
      .subscribe(data => {
        this.average = data;
        this.setGraphData();
      });
      /** Set options to be passed to graph data select */
      this.bubbleOptions = this.dataAttributes.filter(d => d.type === 'bubble');
      console.log(this.bubbleOptions);
    }
    this.barYearSelect = this.graphService.generateYearArray(this.minYear, this.maxYear);
    this.graphTypeOptions = this.createGraphTypeOptions();
    this.graphTypeObject = this.getGraphTypeObject();
    // Update graph axis settings on language change
    this.translate.onLangChange.subscribe(() => {
      this.graphSettings = this.graphType === 'bar' ?
        this.getBarGraphConfig() : this.getLineGraphConfig();
      this.graphTypeOptions = this.createGraphTypeOptions();
      this.graphTypeObject = this.getGraphTypeObject();
    });
    this.graphHover.debounceTime(10).subscribe(e => this.onGraphHover(e));
    this.cd.detectChanges();
  }

  /** Get the current graph attribute with year */
  attrYear(year: number) {
    return this.graphAttribute.id + '-' + year.toString().slice(-2);
  }

  /** Get the current graph attribute with year */
  attrCIYear(year: number, ci: string) {
    return this.graphAttribute.id + ci + '-' + year.toString().slice(-2);
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

  tooltipValueCIs(tooltip): string {
    let _return = '';
    const high = this.translatePipe.transform('DATA.CI_HIGH');
    const low = this.translatePipe.transform('DATA.CI_LOW');
    if (tooltip.ciH && tooltip.ciL) {
      _return += '(';
      if (tooltip.ciH) {
        _return += high + Number(tooltip.ciH).toFixed(2);
      }
      if (tooltip.ciH && tooltip.ciL) {
        _return += '%/';
      }
      if (tooltip.ciL) {
        _return += low + Math.abs(Number(Number(tooltip.ciL).toFixed(2)));
      }
      _return += '%)';
    }
    return _return;
  }

  /** Generates text for the value label under the location in the legend */
  getLegendCI(location, locationIndex: number, high: string, low: string): string {
    // console.log('getLegendCI()');
    if (!location) { return ''; }
    if (!this.graphSettings.ci.display) { return ''; }
    const _high = this.translatePipe.transform('DATA.CI_HIGH');
    const _low = this.translatePipe.transform('DATA.CI_LOW');
    // average is GraphItem so use `data` if `properties` is not available
    const l = location.properties || location.data;
    if (this.graphType === 'bar') {
      const ciH = l[this.attrCIYear(this.barYear, 'h')];
      const ciL = l[this.attrCIYear(this.barYear, 'l')];
      return (ciH > 0 && ciL > 0) ?
        `(${_high}${Number(ciH).toFixed(2)}%/${_low}${Math.abs(Number(Number(ciL).toFixed(2)))}%)`
        : '';
    } else if (this.graphType === 'line') {
      const tooltip = this.tooltips[locationIndex];
      if (!tooltip) { return ''; }
      return (tooltip.ciH > 0 && tooltip.ciL > 0) ?
        this.tooltipValueCIs(tooltip) : '';
    }
    return '';
  }

  /** Formats the value with the provided format */
  formatValue(value, format: string) {
    if (this.graphSettings && value > this.graphSettings.axis.y.maxVal) {
      value = '>' + this.graphSettings.axis.y.maxVal;
    }
    if (format === 'percent') { return value + '%'; }
    return value;
  }

  /**
   * Toggles the graph between judgments / filings
   */
  changeGraphProperty(event: any) {
    const attr = (event.id === this.dataAttributes[0].id) ?
      this.dataAttributes[0] :
      this.dataAttributes[1];
    this.graphAttribute = attr;
  }


  /** Gets config for bar graph */
  getBarGraphConfig() {
    // console.log('getBarGraphConfig()')
    // console.log(this.graphAttribute);
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
          minVal: 0,
          maxVal: 100
        }
      },
      margin: { left: 65, right: 16, bottom: 32, top: 16 },
      ci: { display: this.displayCI, format: this.graphAttribute.id }
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
          minVal: 0,
          maxVal: 100
        }
      },
      margin: { left: 65, right: 16, bottom: 48, top: 16 },
      ci: { display: this.displayCI, format: this.graphAttribute.id }
    };
  }


  /**
   * Sets the data for the graph, and any settings specific to the type
   */
  setGraphData() {
    if (!this.locations || this.locations.length === 0 || !this.graphAttribute) { return; }
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
    const lineLabel = this.translatePipe.transform('DATA.GRAPH_LINE_LABEL');
    const barLabel = this.translatePipe.transform('DATA.GRAPH_BAR_LABEL');
    return [
      {
        id: 'bar',
        value: 'bar',
        label: barLabel,
        langKey: barLabel
      },
      {
        id: 'line',
        value: 'line',
        label: lineLabel,
        langKey: lineLabel
      }
    ];
  }

  getGraphTypeObject() {
    console.log('getGraphTypeObject()');
    console.log('this.graphType: ', this.graphType);
    console.log('this.graphTypeOptions: ', this.graphTypeOptions);
    console.log('this.graphTypeObject: ', this.graphTypeObject);
    this.graphTypeOptions = this.createGraphTypeOptions();
    console.log(this.graphTypeOptions.filter(
      (item) => item.id === this.graphType
    ));
    return this.graphTypeOptions.filter(
      (item) => item.id === this.graphType
    );
  }
}
