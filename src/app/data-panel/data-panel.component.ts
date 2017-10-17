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
  graphSettings: any = {
    axis: { x: { label: null }, y: { label: 'Evictions' } },
    margin: { left: 60 }
  };

  constructor(public dialogService: UiDialogService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations) {
      this.setGraphData();
    }
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

  getGraphData() {
    return [
      ...this.createLocationGraphData(),
      {
        id: 'usavg',
        data: [{
          x: 'US Average',
          y: this.locations[0].properties[`evictions-${this.year}`] * Math.random() * 2
        }]
      }
    ];
  }

  setGraphData() {
    if (this.graphType === 'line') {
      this.graphSettings = {
        axis: { x: { label: 'Year' }, y: { label: 'Evictions' } }
      };
      // TODO: generate line graph data here
    } else {
      this.graphSettings = {
        axis: { x: { label: null }, y: { label: 'Evictions' } }
      };
      this.graphData = this.getGraphData();
    }
  }

  private createLocationGraphData() {
    const data = [];
    this.locations.forEach((f, i) => {
      data.push(
        {
          id: 'sample' + i,
          data: [ { x: f.properties.name, y: f.properties[`evictions-${this.year}`] }]
        }
      );
    });
    return data;
  }

}
