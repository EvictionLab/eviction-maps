import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { UiDialogService } from '../map-ui/ui-dialog/ui-dialog.service';

@Component({
  selector: 'app-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss']
})
export class DataPanelComponent implements OnChanges {

  @Input() locations;
  @Input() year: number;
  @Output() locationRemoved = new EventEmitter();
  graphData;
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
  graphSettings: any = {
    axis: { x: { label: null }, y: { label: 'Evictions' } },
    margin: { left: 60, right: 10 }
  };

  constructor(public dialogService: UiDialogService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations) {
      this.setGraphData();
    }
    if (changes.year && this.graphType === 'bar') {
      this.setGraphData();
    }
  }

  changeGraphType(newType: string) {
    this.graphType = newType.toLowerCase();
    this.setGraphData();
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

  setGraphData() {
    if (this.graphType === 'line') {
      this.graphSettings = {
        axis: { x: { label: 'Year', tickFormat: '.0f' }, y: { label: 'Eviction Rate' } }
      };
      this.graphData = [ ...this.createLineGraphData() ];
    } else {
      this.graphSettings = {
        axis: { x: { label: null }, y: { label: 'Eviction Rate' } }
      };
      this.graphData = [ ...this.createBarGraphData() ];
    }
  }

  private createLineGraphData() {
    const data = [];
    this.locations.forEach((f, i) => {
      data.push(
        {
          id: 'sample' + i,
          data: this.generateLineData(f)
          // data: [{ x: f.properties.n, y: f.properties[`er-${('' + this.year).slice(2)}`] }]
        }
      );
    });
    return data;
  }

  private createBarGraphData() {
    const data = [];
    this.locations.forEach((f, i) => {
      data.push(
        {
          id: 'sample' + i,
          data: [{ x: f.properties.n, y: f.properties[`er-${('' + this.year).slice(2)}`] }]
        }
      );
    });
    return data;
  }

  private generateLineData(feature) {
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push(
        {x: 2010 + i, y: feature.properties[`er-${10 + i}`] }
      );
    }
    return data;
  }

}
