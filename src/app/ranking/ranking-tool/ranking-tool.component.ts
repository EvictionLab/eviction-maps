import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

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
  set region(regionValue) {
    if (regionValue !== this.store.region) {
      this.store.region = regionValue;
      this.updateEvictionList();
    }
  }
  get region() { return this.store.region; }
  /** ID representing the selected area type */
  set areaType(newType) {
    if (newType !== this.store.areaType) {
      this.store.areaType = newType;
      this.updateEvictionList();
    }
  }
  get areaType() { return this.store.areaType; }
  /** object key representing the data property to sort by */
  set dataProperty(newProp) {
    if (newProp !== this.store.dataProperty) {
      this.store.dataProperty = newProp;
      this.updateEvictionList();
    }
  }
  get dataProperty() { return this.store.dataProperty; }
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
  private store = {
    region: 'United States',
    areaType: null,
    dataProperty: null
  };
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
    private scroll: ScrollService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: any
  ) { }

  /** Listen for when the data is ready and for route changes */
  ngOnInit() {
    this.rankings.isReady.subscribe((ready) => {
      this.isDataReady = ready;
      if (ready) { this.updateEvictionList(); }
    });
    this.translate.onLangChange.subscribe(lang => {
      if (this.canNavigate) {
        this.router.navigate(this.getCurrentNavArray(), { queryParams: this.getQueryParams() });
      }
    });
    this.route.url.subscribe(this.onRouteChange.bind(this));
    this.route.queryParams.subscribe(this.onQueryParamChange.bind(this));
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
      this.selectedIndex = url[4] ? parseInt(url[4].path, 10) : null;
    }
  }

  /**
   * Update data from query params
   * @param params
   */
  onQueryParamChange(params) {
    this.translate.use(params['lang'] || 'en');
  }

  /** Update the route when the region changes */
  onRegionChange(newRegion: string) {
    if (this.canNavigate) {
      if (newRegion !== this.region) { this.selectedIndex = null; }
      const newLocation = this.getCurrentNavArray();
      newLocation[2] = newRegion;
      this.router.navigate(newLocation, { queryParams: this.getQueryParams() });
    }
  }

  /** Update the route when the area type changes */
  onAreaTypeChange(areaType: { name: string, value: number }) {
    if (this.canNavigate) {
      if (this.areaType !== null && areaType.value !== this.areaType.value) {
        this.selectedIndex = null;
      }
      const newLocation = this.getCurrentNavArray();
      newLocation[3] = areaType.value;
      this.router.navigate(newLocation, { queryParams: this.getQueryParams() });
    }
  }

  /** Update the sort property when the area type changes */
  onDataPropertyChange(dataProp: { name: string, value: string }) {
    if (this.canNavigate) {
      if (this.dataProperty !== null && dataProp.value !== this.dataProperty.value) {
        this.selectedIndex = null;
      }
      const newLocation = this.getCurrentNavArray();
      newLocation[4] = dataProp.value;
      this.router.navigate(newLocation, { queryParams: this.getQueryParams() });
    }
  }

  /** Update current location */
  setCurrentLocation(locationIndex: number) {
    if (this.canNavigate) {
      const newLocation = this.getCurrentNavArray();
      if (locationIndex || locationIndex === 0) {
        newLocation[5] = locationIndex;
      } else {
        newLocation.splice(-1, 1);
      }
      this.router.navigate(newLocation, { queryParams: this.getQueryParams() });
    }
  }

  onSearchSelectLocation(location: RankingLocation | null) {
    if (location === null) {
      this.setCurrentLocation(null);
      return;
    }
    this.showUiPanel = false;
    const listIndex = this.listData.map(d => d.geoId).indexOf(location.geoId);
    let selectedIndex = -1;
    if (listIndex > -1) {
      selectedIndex = listIndex;
    } else {
      this.region = 'United States';
      this.areaType = this.rankings.areaTypes.filter(t => t.value === location.areaType)[0];
      this.updateEvictionList();
      selectedIndex = this.listData.map(d => d.geoId).indexOf(location.geoId);
    }
    if (selectedIndex < this.topCount) {
      this.scroll.scrollTo(`.ranking-list > li:nth-child(${selectedIndex + 1})`);
    }
    this.setCurrentLocation(selectedIndex);
  }

  onClickLocation(index: number) {
    this.setCurrentLocation(index);
  }

  /** Switch the selected location to the next one in the list */
  onGoToNext() {
    if (this.selectedIndex < this.listData.length - 1) {
      this.setCurrentLocation(this.selectedIndex + 1);
    }
  }

  /** Switch the selected location to the previous one in the list */
  onGoToPrevious() {
    if (this.selectedIndex > 0) {
      this.setCurrentLocation(this.selectedIndex - 1);
    }
  }

  /** Removes currently selected index on closing the panel */
  onClose() {
    this.setCurrentLocation(null);
  }

  scrollToTop() {
    this.scroll.scrollTo('app-ranking-list');
  }

  private getCurrentNavArray() {
    const routeArray =  [
      '/',
      this.activeTab,
      this.region,
      this.areaType.value,
      this.dataProperty.value
    ];
    if (this.selectedIndex || this.selectedIndex === 0) {
      routeArray.push(this.selectedIndex);
    }
    return routeArray;
  }

  private getQueryParams() {
    return { lang: this.translate.currentLang };
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
