import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { RankingLocation } from '../ranking-location';
import { RankingService } from '../ranking.service';
import { RoutingService } from '../../services/routing.service';
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
    private translate: TranslateService,
    private route: ActivatedRoute,
    private routing: RoutingService,
    private scroll: ScrollService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.routing.setActivatedRoute(this.route);
  }

  /** Listen for when the data is ready and for route changes */
  ngOnInit() {
    this.routing.getCombinedRouteData().take(1)
      .subscribe(data => this.setRouteData(data));
    this.rankings.isReady.subscribe((ready) => {
      this.isDataReady = ready;
      if (ready) { this.updateEvictionList(); }
    });
  }

  /** Update the route when the region changes */
  onRegionChange(newRegion: string) {
    this.region = newRegion;
    this.updateProp();
  }

  /** Update the route when the area type changes */
  onAreaTypeChange(areaType: { name: string, value: number, langKey: string }) {
    this.areaType = areaType;
    this.updateProp();
  }

  /** Update the sort property when the area type changes */
  onDataPropertyChange(dataProp: { name: string, value: string, langKey: string }) {
    this.dataProperty = dataProp;
    this.updateProp();
  }

  onSearchSelectLocation(location: RankingLocation | null) {
    if (location === null) {
      this.selectedIndex = undefined;
      return;
    }
    this.showUiPanel = false;
    const listIndex = this.listData.map(d => d.geoId).indexOf(location.geoId);
    if (listIndex > -1) {
      this.selectedIndex = listIndex;
    } else {
      this.region = 'United States';
      this.areaType = this.rankings.areaTypes.filter(t => t.value === location.areaType)[0];
      this.updateEvictionList();
      this.selectedIndex = this.listData.map(d => d.geoId).indexOf(location.geoId);
    }
    if (this.selectedIndex < this.topCount) {
      this.scroll.scrollTo(`.ranking-list > li:nth-child(${this.selectedIndex + 1})`);
    }
    this.updateRoute();
  }

  onClickLocation(index: number) {
    this.selectedIndex = index;
    this.updateRoute();
  }

  /** Switch the selected location to the next one in the list */
  onGoToNext() {
    if (this.selectedIndex < this.listData.length - 1) {
      this.selectedIndex++;
      this.updateRoute();
    }
  }

  /** Switch the selected location to the previous one in the list */
  onGoToPrevious() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.updateRoute();
    }
  }

  /** Removes currently selected index on closing the panel */
  onClose() {
    this.selectedIndex = undefined;
    this.updateRoute();
  }

  scrollToTop() {
    this.scroll.scrollTo('app-ranking-list');
  }

  private updateProp() {
    if (this.isDataReady) { this.selectedIndex = undefined; }
    this.updateEvictionList();
    this.updateRoute();
  }

  private updateRoute() {
    if (this.canNavigate) {
      this.routing.updateRouteData(this.getRouteData());
    }
  }

  private setRouteData(data: Object) {
    this.translate.use(data['lang'] || 'en');
    if (data['tab']) { this.activeTab = data['tab']; }
    if (data['region']) { this.region = data['region']; }
    if (data['areaType']) {
      this.areaType = this.rankings.areaTypes.filter(t => t.value === +data['areaType'])[0];
    }
    if (data['sortProp']) {
      this.dataProperty = this.rankings.sortProps.filter(p => p.value === data['sortProp'])[0];
    }
    if (this.activeTab === 'evictions') {
      this.updateEvictionList();
    }
    if (data['index']) { this.selectedIndex = +data['index']; }
  }

  private getRouteData() {
    if (this.activeTab === 'evictions') {
      const indexObj = this.selectedIndex >= 0 ? { index: this.selectedIndex } : {};
      return {
        tab: this.activeTab,
        region: this.region,
        areaType: this.areaType.value,
        sortProp: this.dataProperty.value,
        lang: this.translate.currentLang,
        ...indexObj
      };
    } else {
      return { tab: this.activeTab };
    }
  }

  /**
   * Update the list data based on the selected UI properties
   */
  private updateEvictionList() {
    if (this.canRetrieveData) {
      this.listData =
        this.rankings.getFilteredData(this.region, this.areaType.value, this.dataProperty.value);
      this.truncatedList = this.listData.slice(0, this.topCount);
      this.dataMax = Math.max.apply(
        Math, this.truncatedList.map(l => {
          return !isNaN(l[this.dataProperty.value]) ? l[this.dataProperty.value] : 0;
        })
      );
      console.log('got list data:', this.listData, this.truncatedList, this.dataMax);
      // Setup full data and scroll if initial data load
      if (!this.fullData) {
        this.fullData = this.rankings.getSortedData(this.dataProperty.value);
        this.setupPageScroll();
      }
    } else {
      console.warn('data is not ready yet');
    }
  }

  private setupPageScroll() {
    this.scroll.defaultScrollOffset = 175;
    this.scroll.setupScroll();

    const listYOffset = this.document.querySelector('app-ranking-list').getBoundingClientRect().top;
    this.scroll.verticalOffset$.debounceTime(100)
      .subscribe(offset => {
        this.showScrollButton = offset > listYOffset;
      });
  }

}
