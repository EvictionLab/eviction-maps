import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-eviction-graphs',
  templateUrl: './eviction-graphs.component.html',
  styleUrls: ['./eviction-graphs.component.scss']
})
export class EvictionGraphsComponent implements OnInit {

/** Graph type input and output (allows double binding) */
private _graphType = 'line';
@Input() set graphType(type: string) {
  if (this._graphType !== type) {
    this.graphTypeChange.emit(type);
  }
  this._graphType = type;
}
get graphType() { return this._graphType; }
@Output() graphTypeChange = new EventEmitter();

showUS = true; // visibility state of the US Avg on graph
tooltips = []; // attribute for holding tooltip data
graphTypeOptions = this.createGraphTypeOptions(); // attribute w/ object of graph options
graphProp = 'er'; // current graph property (sync with map?)
graphData; // graph data that is passed to the graph component
graphSettings; // attribute for passing graph settings to graph component
startSelect: Array<number>; // array of years for the "start year" select for line graph
endSelect: Array<number>; // array of years for the "end year" select for line graph
minYear = environment.minYear; // minimum allowed year for year selects
maxYear = environment.maxYear; // maximum allowed year for year selects
lineStartYear: number = this.minYear; // value of the start year on the line graph
lineEndYear: number = this.maxYear; // value of the end year on the line graph
barYearSelect: Array<number>; // array of years for bar graph select
graphHover = new EventEmitter(); // event emitter for when user hovers the graph
private graphTimeout; // tracks if a timeout is set to update graph settings

  constructor(
    private translatePipe: TranslatePipe,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.barYearSelect = this.generateYearArray(this.minYear, this.maxYear);
    // Update graph axis settings on language change
    this.translate.onLangChange.subscribe(() => {
      this.graphSettings = this.graphType === 'bar' ?
        this.barGraphSettings : this.lineGraphSettings;
      this.graphTypeOptions = this.createGraphTypeOptions();
    });
    this.graphHover.debounceTime(50)
      .subscribe(e => this.onGraphHover(e));
  }

  updateGraphSettings() {

  }

  /**
   * Updates the graph to the `start` and `end` X values
   */
  updateLineYears(start: any, end: any) {
    this.lineStartYear = Number(start);
    this.lineEndYear = Math.max(Number(end), this.lineStartYear + 1);
    this.startSelect = this.generateYearArray(this.minYear, this.lineEndYear - 1);
    this.endSelect = this.generateYearArray(this.lineStartYear + 1, this.maxYear);
    this.setGraphData();
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

  /** track tooltips by ID so they are animated properly */
  trackTooltips(index, item) { return item.id; }

  /** changes graph to either line or bar and resets tooltips */
  changeGraphType(newType: string) {
    if (typeof newType === 'string') {
      this.graphTypeChange.emit(newType.toLowerCase());
    }
    this.tooltips = [];
  }

  /**
   * Toggles the graph between judgments / filings
   */
  changeGraphProperty(filings: boolean) {
    this.graphProp = filings ? 'efr' : 'er';
    this.setGraphData();
  }

  /**
   * Updates the bar to the provided year
   * @param year
   */
  updateBarYear(year: number) {
    this.year = year;
    this.setGraphData();
  }

  getBarGraphConfig() {
    return {
      title: this.translatePipe.transform('DATA.BAR_GRAPH_TITLE', {
        type: this.translatePipe.transform(this.cardProps[this.graphProp]),
        locations: this.getLocations()
          .map(l => l.properties.n).join(', '),
        year: this.year
      }),
      description: this.translatePipe.transform('DATA.BAR_GRAPH_DESC', {
        type: this.translatePipe.transform(this.cardProps[this.graphProp]),
        locations: this.getLocations()
          .map(l => `${l.properties.n} (${l.properties[this.getGraphPropForYear(this.year)]})`)
          .join(', '),
        year: this.year
      }),
      axis: {
        x: { label: null, tickFormat: '.0f' },
        y: {
          label: this.translatePipe.transform(this.cardProps[this.graphProp]),
          tickSize: '-100%',
          ticks: 5,
          tickPadding: 5
        }
      },
      margin: { left: 65, right: 16, bottom: 32, top: 16 }
    };
  }

  getLineGraphConfig() {
    return {
      title: this.translatePipe.transform('DATA.LINE_GRAPH_TITLE', {
        type: this.translatePipe.transform(this.cardProps[this.graphProp]),
        locations: this.getLocations().map(l => l.properties.n).join(', '),
        year1: this.lineStartYear,
        year2: this.lineEndYear
      }),
      description: this.translatePipe.transform('DATA.LINE_GRAPH_DESC', {
        type: this.translatePipe.transform(this.cardProps[this.graphProp])
      }),
      axis: {
        x: {
          label: null,
          tickFormat: '.0f',
          ticks: Math.min(5, this.lineEndYear - this.lineStartYear),
          tickPadding: 10
        },
        y: {
          label: this.translatePipe.transform(this.cardProps[this.graphProp]),
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
    this.tooltips = [];
    if (this.graphType === 'line') {
      this.graphSettings = this.lineGraphSettings;
      this.graphData = [...this.createLineGraphData()];
    } else {
      this.graphSettings = this.barGraphSettings;
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

  toggleUS() {
    this.showUS = !this.showUS;
    this.setGraphData();
  }


  /**
   * Genrates line graph data from the features in `locations`
   */
  private createLineGraphData() {
    return this.getLocations().map((f, i) => {
      return { id: 'sample' + i, data: this.generateLineData(f) };
    });
  }

  /**
   * Generate bar graph data from the features in `locations
   */
  private createBarGraphData() {
    return this.getLocations().map((f, i) => {
      const yVal = (f.properties[this.getGraphPropForYear(this.year)]);
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
        const yVal = feature.properties[this.getGraphPropForYear(year)];
        return { x: year, y: yVal !== -1 && yVal !== null ? yVal : undefined };
      });
  }

  /** Get the current graph property with a year appended to it */
  private getGraphPropForYear(year) {
    return `${this.graphProp}-${('' + year).slice(2)}`;
  }

  private createGraphTypeOptions() {
    return [
      { value: 'bar', label: this.translatePipe.transform('DATA.GRAPH_BAR_LABEL') },
      { value: 'line', label: this.translatePipe.transform('DATA.GRAPH_LINE_LABEL')}
    ];
  }

}
