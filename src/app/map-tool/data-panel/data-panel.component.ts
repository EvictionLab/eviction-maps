import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DownloadFormComponent } from './download-form/download-form.component';
import { UiDialogService } from '../../ui/ui-dialog/ui-dialog.service';
import { MapFeature } from '../map/map-feature';

@Component({
  selector: 'app-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss']
})
export class DataPanelComponent implements OnChanges {

  @Input() locations: MapFeature[] = [];
  @Input() year: number;
  @Output() locationRemoved = new EventEmitter();
  @Output() locationAdded = new EventEmitter();
  graphData;
  tooltips = [];
  graphType = 'bar';
  cardProps = {
    'er': 'Eviction Rate',
    'e': 'Evictions',
    'efr': 'Eviction Filing Rate',
    'ef': 'Eviction Filings',
    'pr': 'Poverty Rate',
    'p': 'Population',
    'roh': 'Renter Occupied Houses',
    'ahs': 'Average House Size'
  };
  graphProp = 'er';
  graphSettings;
  lineStartYear = this.year;
  lineEndYear = 2017;
  barYear = this.year;
  startSelect = this.generateYearArray(1990, this.lineEndYear - 1);
  endSelect = this.generateYearArray(this.lineStartYear + 1, 2017);

  constructor(public dialogService: UiDialogService) { }

  /**
   * Update the graph data when locations or year changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations) {
      this.setGraphData();
    }
    if (changes.year && this.graphType === 'bar') {
      this.setGraphData();
    }
  }

  /**
   * Updates the bar to the provided year
   * @param year
   */
  updateBarYear(year: number) {
    this.barYear = year;
    this.setGraphData();
  }

  /**
   * Updates the graph to the `start` and `end` X values
   */
  updateLineYears(start: number, end: number) {
    this.lineStartYear = start;
    this.lineEndYear = Math.max(end, start + 1);
    this.startSelect = this.generateYearArray(1990, this.lineEndYear - 1);
    this.endSelect = this.generateYearArray(this.lineStartYear + 1, 2016);
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

  trackTooltips(index, item) {
    return item.id;
  }

  changeGraphType(newType: string) {
    this.graphType = newType.toLowerCase();
    this.tooltips = [];
    this.setGraphData();
  }

  changeGraphProperty(selected: string) {
    this.graphProp = selected === 'Judgments' ? 'er' : 'efr';
    this.setGraphData();
  }

  showDownloadDialog(e) {
    const config = {
      lang: 'en',
      startYear: this.year,
      endYear: this.lineEndYear,
      features: this.locations
    };
    this.dialogService.showDownloadDialog(DownloadFormComponent, config);
  }

  showFileDialog(e) {
    this.dialogService.showDialog({
      title: 'Select a file type',
      content: [
        { type: 'text', data: 'Check one or more of the file types:' },
        { type: 'checkbox', data: { value: false, label: 'PDF' } },
        { type: 'checkbox', data: { value: false, label: 'Excel' } }
      ]
    }).subscribe((response) => {
      console.log(response);
    });
  }

  /**
   * Sets the data for the graph, and any settings specific to the type
   */
  setGraphData() {
    this.tooltips = [];
    if (this.graphType === 'line') {
      this.graphSettings = {
        axis: {
          x: { label: 'Year', tickFormat: '.0f' },
          y: { label: this.cardProps[this.graphProp] }
        }
      };
      this.graphData = [ ...this.createLineGraphData() ];
    } else {
      this.graphSettings = {
        axis: { x: { label: null }, y: { label: this.cardProps[this.graphProp] } }
      };
      this.graphData = [ ...this.createBarGraphData() ];
    }
  }

  /**
   * Creates an array with number values from `start` to `end`
   */
  generateYearArray(start: number, end: number): Array<number> {
    const arr = [];
    for (let i = start; i <= end; i++) { arr.push(i); }
    return arr;
  }

  /**
   * Adding method because calling window directly in the template doesn't work
   */
  getCurrentUrl() {
    return window.location.href;
  }

  /**
   * Genrates line graph data from the features in `locations`
   */
  private createLineGraphData() {
    return this.locations.map((f, i) => {
      return { id: 'sample' + i, data: this.generateLineData(f) };
    });
  }

  /**
   * Generate bar graph data from the features in `locations
   */
  private createBarGraphData() {
    return this.locations.map((f, i) => {
      const yVal = (f.properties[`${this.graphProp}-${('' + this.barYear).slice(2)}`]);
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
        const yVal = feature.properties[`${this.graphProp}-${('' + year).slice(2)}`];
        if (yVal) {
          return { x: year, y: yVal };
        }
      });
  }

}
