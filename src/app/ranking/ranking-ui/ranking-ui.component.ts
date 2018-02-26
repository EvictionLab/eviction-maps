import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { RankingLocation } from '../ranking-location';

@Component({
  selector: 'app-ranking-ui',
  templateUrl: './ranking-ui.component.html',
  styleUrls: ['./ranking-ui.component.scss']
})
export class RankingUiComponent implements OnInit {
  @Input() locationList: Array<RankingLocation>;
  @Input() regions; // Array of regions (states) to filter by
  @Input() areaTypes; // Array of area types (rural, mid-sized, etc)
  @Input() dataProperties; // Array of data properties to sort by
  @Output() selectedLocationChange = new EventEmitter<any>();
  @Input() selectedAreaType;
  @Output() selectedAreaTypeChange = new EventEmitter<any>();
  @Input() selectedDataProperty;
  @Output() selectedDataPropertyChange = new EventEmitter<any>();
  @Input() selectedRegion;
  @Output() selectedRegionChange = new EventEmitter<string>();
  @Output() applyFilters = new EventEmitter<any>();
  @Output() clearFilters = new EventEmitter<any>();
  @Output() closePanel = new EventEmitter<any>();
  constructor(public el: ElementRef) { }

  ngOnInit() {}

}
