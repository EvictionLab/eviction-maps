import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ranking-ui',
  templateUrl: './ranking-ui.component.html',
  styleUrls: ['./ranking-ui.component.scss']
})
export class RankingUiComponent implements OnInit {
  @Input() tabs; // Array of tabs available with different types of ranking
  @Input() regions; // Array of regions (states) to filter by
  @Input() areaTypes; // Array of area types (rural, mid-sized, etc)
  @Input() dataProperties; // Array of data properties to sort by
  @Input() selectedAreaType;
  @Output() selectedAreaTypeChange;
  @Input() selectedDataProperty;
  @Output() selectedDataPropertyChange;
  @Input() selectedTab;
  @Output() selectedTabChange;
  @Input() selectedRegion;
  @Output() selectedRegionChange;

  constructor() { }

  ngOnInit() {}

}
