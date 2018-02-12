import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import { RankingLocation } from '../ranking-location';
import { RankingService } from '../ranking.service';
import { ScrollService } from '../../services/scroll.service';
import { RankingUiComponent } from '../ranking-ui/ranking-ui.component';

@Component({
  selector: 'app-ranking-tool',
  templateUrl: './ranking-tool.component.html',
  styleUrls: ['./ranking-tool.component.scss']
})
export class RankingToolComponent implements OnInit {
  /** identifier for the component so AppComponent can detect type */
  id = 'ranking-tool';
  /** tab ID for the active tab */
  activeTab = 'evictions';
  /** string representing the region */
  region = 'United States';
  /** ID representing the selected area type */
  areaType = null;
  /** object key representing the data property to sort by */
  dataProperty = null;
  /** the index of the selected location for the data panel */
  selectedIndex: number;
  /** tracks if the data has been loaded and parsed */
  isDataReady = false;
  /** A shortened version of `listData`, containing only the first `topCount` items */
  truncatedList: Array<RankingLocation>;
  /** Stores the maximum value in the truncated List */
  dataMax = 1;
  /** full list of sorted data from rankings */
  fullData: Array<RankingLocation>;
  /** list of data for the current UI selections */
  listData: Array<RankingLocation>; // Array of locations to show the rank list for
  /** state for UI panel on mobile / tablet */
  showUiPanel = false;
  /** Boolean of whether to show scroll to top button */
  showScrollButton = false;
  /** number of items to show in the list */
  private topCount = 100;
  /** returns if all of the required params are set to be able to fetch data */
  get canRetrieveData(): boolean {
    return this.canNavigate && this.isDataReady;
  }
  private get canNavigate(): boolean {
    return this.region && this.areaType && this.dataProperty &&
      this.areaType.hasOwnProperty('value') &&
      this.dataProperty.hasOwnProperty('value');
  }

  constructor(
    public rankings: RankingService,
    private route: ActivatedRoute,
    private router: Router,
    private pageScrollService: PageScrollService,
    private scroll: ScrollService,
    @Inject(DOCUMENT) private document: any
  ) { }

  /** Listen for when the data is ready and for route changes */
  ngOnInit() {
    this.rankings.isReady.subscribe((ready) => {
      this.isDataReady = ready;
      if (ready) { this.updateEvictionList(); }
    });
    this.route.url.subscribe(this.onRouteChange.bind(this));
  }

  /**
   * When the route changes, update the selected properties with the values
   * in the route, and then update the list data
   */
  onRouteChange(url) {
    this.activeTab = url[0].path;
    if (this.activeTab === 'evictions') {
      this.region = url[1].path;
      this.areaType = this.rankings.areaTypes.find(a => a.value === parseInt(url[2].path, 10));
      this.dataProperty = this.rankings.sortProps.find(p => p.value === url[3].path);
      this.updateEvictionList();
    }
  }

  /** Update the route when the region changes */
  onRegionChange(newRegion: string) {
    if (this.canNavigate) {
      this.router.navigate(
        ['/', this.activeTab, newRegion, this.areaType.value, this.dataProperty.value]
      );
    }
  }

  /** Update the route when the area type changes */
  onAreaTypeChange(areaType: { name: string, value: number }) {
    if (this.canNavigate) {
      this.router.navigate(
        ['/', this.activeTab, this.region, areaType.value, this.dataProperty.value]
      );
    }
  }

  /** Update the sort property when the area type changes */
  onDataPropertyChange(dataProp: { name: string, value: string }) {
    if (this.canNavigate) {
      this.router.navigate(
        ['/', this.activeTab, this.region, this.areaType.value, dataProp.value]
      );
    }
  }

  onSearchSelectLocation(location: RankingLocation | null) {
    if (location === null) {
      this.selectedIndex = undefined;
      return;
    }
    const listIndex = this.listData.map(d => d.geoId).indexOf(location.geoId);
    if (listIndex > -1) {
      this.selectedIndex = listIndex;
    } else {
      this.region = 'United States';
      this.areaType = this.rankings.areaTypes.filter(t => t.value === location.areaType)[0];
      this.updateEvictionList();
      this.selectedIndex = this.listData.map(d => d.geoId).indexOf(location.geoId);
    }
  }

  onClickLocation(index: number) {
    this.selectedIndex = index;
  }

  /** Switch the selected location to the next one in the list */
  onGoToNext() {
    if (this.selectedIndex < this.listData.length - 1) {
      this.selectedIndex++;
    }
  }

  /** Switch the selected location to the previous one in the list */
  onGoToPrevious() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  /** Removes currently selected index on closing the panel */
  onClose() {
    this.selectedIndex = undefined;
  }

  scrollToTop() {
    const pageScrollInstance = PageScrollInstance.simpleInstance(this.document, 'app-ranking-list');
    this.pageScrollService.start(pageScrollInstance);
  }

  /**
   * Update the list data based on the selected UI properties
   */
  private updateEvictionList() {
    if (this.canRetrieveData) {
      if (!this.fullData) {
        this.fullData = this.rankings.getSortedData(this.dataProperty.value);
      }
      this.listData =
        this.rankings.getFilteredData(this.region, this.areaType.value, this.dataProperty.value);
      this.truncatedList = this.listData.slice(0, this.topCount);
      this.dataMax = Math.max.apply(
        Math, this.truncatedList.map(l => {
          return !isNaN(l[this.dataProperty.value]) ? l[this.dataProperty.value] : 0;
        })
      );
      console.log('got list data:', this.listData, this.truncatedList, this.dataMax);
      this.setupPageScroll();
    } else {
      console.warn('data is not ready yet');
    }
  }

  private setupPageScroll() {
    PageScrollConfig.defaultScrollOffset = 120;
    PageScrollConfig.defaultDuration = 1000;
    // easing function pulled from:
    // https://joshondesign.com/2013/03/01/improvedEasingEquations
    PageScrollConfig.defaultEasingLogic = {
      ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
    };

    const listYOffset = this.document.querySelector('app-ranking-list').getBoundingClientRect().top;
    this.scroll.verticalOffset$.debounceTime(100)
      .subscribe(offset => {
        this.showScrollButton = offset > listYOffset;
      });
  }

}
