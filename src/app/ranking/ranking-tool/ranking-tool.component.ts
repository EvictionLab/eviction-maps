import { Component, OnInit } from '@angular/core';
import { RankingLocation } from '../ranking-location';
import { RankingService } from '../ranking.service';

@Component({
  selector: 'app-ranking-tool',
  templateUrl: './ranking-tool.component.html',
  styleUrls: ['./ranking-tool.component.scss']
})
export class RankingToolComponent implements OnInit {
  activeTab: string; // tab ID for the active tab
  areaType: string; // ID representing the selected area type
  dataProperty: string; // object key representing the data property to sort by
  listData: Array<RankingLocation>; // Array of locations to show the rank list for
  selectedLocation: RankingLocation; // the currently selected location for the data panel

  constructor(private rankings: RankingService) { }

  /** Load the ranking data on init */
  ngOnInit() {
    this.rankings.loadCsvData();
  }

  /** Switch the selected location to the next one in the list */
  goToNextLocation() { }
  
  /** Switch the selected location to the previous one in the list */
  goToPreviousLocation() { }

}
