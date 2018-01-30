import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { MapDataAttribute } from '../../map/map-data-attribute';

@Component({
  selector: 'app-eviction-graphs',
  templateUrl: './eviction-graphs.component.html',
  styleUrls: ['./eviction-graphs.component.scss']
})
export class EvictionGraphsComponent implements OnInit {

  @Input() dataAttributes: MapDataAttribute[];

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

  /** Line graph year start input / output (allows double binding) */
  private _lineStartYear;
  @Input() set lineStartYear(value: number) {
    if (value !== this._lineStartYear) {
      this._lineStartYear = value;
      this.lineStartYearChange.emit(this._lineStartYear);
      this.startSelect = this.generateYearArray(this.minYear, this.lineEndYear - 1);
      this.endSelect = this.generateYearArray(this.lineStartYear + 1, this.maxYear);
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
      this.startSelect = this.generateYearArray(this.minYear, this.lineEndYear - 1);
      this.endSelect = this.generateYearArray(this.lineStartYear + 1, this.maxYear);
      if (this.graphType === 'line') {
        this.setGraphData();
      }
    }
  }
  get lineEndYear() { return this._lineEndYear; }
  @Output() lineEndYearChange = new EventEmitter();

  /** Locations */
  private _locations = [];
  @Input() set locations(value) {
    this._locations = value;
    this.setGraphData();
  }
  get locations() { return this._locations; }
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

  /** Data for averages on graph */
  private _average;
  @Input() set average(value) {
    this._average = {
      type: 'Feature',
      properties: { n: 'United States', ...value },
      geometry: { type: 'Point', coordinates: [] }
    };
    this.setGraphData();
  }
  get average() { return this._average; }

  /** Tracks if average is shown */
  private _showAverage = true;
  @Input() set showAverage(value: boolean) {
    if (value !== this.showAverage) {
      this._showAverage = value;
      this.showAverageChange.emit(value);
      this.setGraphData();
    }
  }
  get showAverage() { return this._showAverage; }
  @Output() showAverageChange = new EventEmitter();

  tooltips = []; // attribute for holding tooltip data
  graphTypeOptions = this.createGraphTypeOptions(); // attribute w/ object of graph options
  graphAttribute: MapDataAttribute; // current graph property (sync with map?)
  graphData; // graph data that is passed to the graph component
  graphSettings; // attribute for passing graph settings to graph component
  startSelect: Array<number>; // array of years for the "start year" select for line graph
  endSelect: Array<number>; // array of years for the "end year" select for line graph
  minYear = environment.minYear; // minimum allowed year for year selects
  maxYear = environment.maxYear; // maximum allowed year for year selects
  barYearSelect: Array<number>; // array of years for bar graph select
  graphHover = new EventEmitter(); // event emitter for when user hovers the graph
  private graphTimeout; // tracks if a timeout is set to update graph settings

  constructor(
    private translatePipe: TranslatePipe,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.graphAttribute = this.dataAttributes[0];
    this.barYearSelect = this.generateYearArray(this.minYear, this.maxYear);
    // Update graph axis settings on language change
    this.translate.onLangChange.subscribe(() => {
      this.graphSettings = this.graphType === 'bar' ?
        this.getBarGraphConfig() : this.getLineGraphConfig();
      this.graphTypeOptions = this.createGraphTypeOptions();
    });
    this.graphHover.debounceTime(10)
      .subscribe(e => this.onGraphHover(e));
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
    const l = location;
    if (this.graphType === 'bar') {
      const value = l.properties[this.attrYear(this.barYear)];
      return value >= 0 ?
        this.barYear + ': ' + value + '%' :
        this.translatePipe.transform('DATA.UNAVAILABLE');
    } else if (this.graphType === 'line') {
      const tooltip = this.tooltips[locationIndex];
      if (!tooltip) { return ''; }
      const value = l.properties[this.attrYear(tooltip.x)];
      return value >= 0 ?
        tooltip.x + ': ' + value + '%' :
        this.translatePipe.transform('DATA.UNAVAILABLE');
    }
    return '';
  }

  /** track tooltips by ID so they are animated properly */
  trackTooltips(index, item) { return item.id; }

  /**
   * Toggles the graph between judgments / filings
   */
  changeGraphProperty(filings: boolean) {
    this.graphAttribute = filings ? this.dataAttributes[1] : this.dataAttributes[0];
    this.setGraphData();
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
          label: this.graphAttribute.name,
          tickSize: '-100%',
          ticks: 5,
          tickPadding: 5
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
          label: this.graphAttribute.name,
          tickSize: '-100%',
          ticks: 5,
          tickPadding: 5
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

  /**
   * Creates an array with number values from `start` to `end`
   */
  generateYearArray(start: number, end: number): Array<number> {
    const arr = [];
    for (let i = start; i <= end; i++) { arr.push(i); }
    if (arr.length === 0) { arr.push(end); }
    return arr;
  }

  getTooltipsYear(tooltips: Object[]) {
    for (let i = 0; i < tooltips.length; ++i) {
      if (tooltips[i]['x'] !== null) {
        return tooltips[i]['x'];
      }
    }
    return null;
  }


  /**
   * Genrates line graph data from the features in `locations`
   */
  private createLineGraphData() {
    const locations = this.showAverage && this.average ?
      [...this.locations, this.average] : this.locations;
    return locations.map((f, i) => {
      return { id: 'sample' + i, data: this.generateLineData(f) };
    });
  }

  /**
   * Generate bar graph data from the features in `locations
   */
  private createBarGraphData() {
    const locations = this.showAverage && this.average ?
      [...this.locations, this.average] : this.locations;
    return locations.map((f, i) => {
      const yVal = (f.properties[this.attrYear(this.barYear)]);
      return {
        id: 'sample' + i,
        data: [{
          x: f.properties.n,
          y: yVal ? yVal : 0
        }]
      };
    });
  }

  private generateLineData(feature) {
    return this.generateYearArray(this.lineStartYear, this.lineEndYear)
      .map((year) => {
        // create points
        const yVal = feature.properties[this.attrYear(year)];
        return { x: year, y: yVal !== -1 && yVal !== null ? yVal : undefined };
      });
  }

  private createGraphTypeOptions() {
    return [
      { value: 'bar', label: this.translatePipe.transform('DATA.GRAPH_BAR_LABEL') },
      { value: 'line', label: this.translatePipe.transform('DATA.GRAPH_LINE_LABEL')}
    ];
  }
}
