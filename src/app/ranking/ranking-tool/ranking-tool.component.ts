import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';

import { RankingLocation } from '../ranking-location';
import { RankingService } from '../ranking.service';

@Component({
  selector: 'app-ranking-tool',
  templateUrl: './ranking-tool.component.html',
  styleUrls: ['./ranking-tool.component.scss']
})
export class RankingToolComponent implements OnInit {
  id = 'ranking-tool';
  activeTab = "evictions"; // tab ID for the active tab
  region = "United States"; // string representing the region
  areaType = null; // ID representing the selected area type
  dataProperty = null; // object key representing the data property to sort by
  listData: Array<RankingLocation>; // Array of locations to show the rank list for
  selectedLocation: RankingLocation; // the currently selected location for the data panel
  isDataReady = false;
  /** returns if all of the required params are set to be able to fetch data */
  get canRetrieveData():boolean {
    return this.region && this.areaType.hasOwnProperty('value') &&
      this.dataProperty.hasOwnProperty('value') && this.isDataReady;
  }

  constructor(
    public rankings: RankingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /** Load the ranking data on init */
  ngOnInit() {
    this.rankings.isReady.subscribe((ready) => {
      this.isDataReady = ready;
      if (ready) { this.updateEvictionList(); }
    });
    this.route.url.subscribe(this.onRouteChange.bind(this));
  }

  onRouteChange(url) {
    console.log('route change', url);
    this.activeTab = url[0].path;
    if (this.activeTab === 'evictions') {
      this.region = url[1].path;
      this.areaType = this.rankings.areaTypes.find(a => a.value === parseInt(url[2].path));
      this.dataProperty = this.rankings.sortProps.find(p => p.value === url[3].path);
      this.updateEvictionList();
    }
  }

  onRegionChange(newRegion: string) {
    this.router.navigate(['/', this.activeTab, newRegion, this.areaType.value, this.dataProperty.value ]);    
  }

  onAreaTypeChange(areaType: { name: string, value: number }) {
    this.router.navigate(['/', this.activeTab, this.region, areaType.value, this.dataProperty.value ]);    
  }

  onDataPropertyChange(dataProp: { name: string, value: string}) {
    this.router.navigate(['/', this.activeTab, this.region, this.areaType.value, dataProp.value ]);    
  }
  

  /** Switch the selected location to the next one in the list */
  goToNextLocation() { }
  
  /** Switch the selected location to the previous one in the list */
  goToPreviousLocation() { }

  /**
   * Update the list data based on the selected UI properties
   */
  private updateEvictionList() {
    if (this.canRetrieveData) {
      console.log('getting data', this.region, this.areaType.value, this.dataProperty.value);
      this.listData =
        this.rankings.getSortedData(this.region, this.areaType.value, this.dataProperty.value);
      console.log('got list data:', this.listData);
    } else {
      console.warn('data is not ready yet');
    }
  }

}
