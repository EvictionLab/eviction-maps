import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ranking-ui',
  templateUrl: './ranking-ui.component.html',
  styleUrls: ['./ranking-ui.component.scss']
})
export class RankingUiComponent implements OnInit {
  @Input() regions; // Array of regions (states) to filter by
  @Input() areaTypes; // Array of area types (rural, mid-sized, etc)
  @Input() dataProperties; // Array of data properties to sort by
  @Input() selectedAreaType;
  @Output() selectedAreaTypeChange = new EventEmitter<any>();
  @Input() selectedDataProperty;
  @Output() selectedDataPropertyChange = new EventEmitter<any>();
  @Input() selectedRegion;
  @Output() selectedRegionChange = new EventEmitter<string>();

  constructor(public el: ElementRef) { }

  ngOnInit() {}

}
