import {
  Component, OnInit, Input, OnDestroy, ViewChild, Inject, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { ToastsManager, ToastOptions } from 'ng2-toastr';


import { RankingLocation } from '../../ranking-location';
import { RankingService } from '../../ranking.service';
import { ScrollService } from '../../../services/scroll.service';
import { LoadingService } from '../../../services/loading.service';
import { PlatformService } from '../../../services/platform.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { RankingUiComponent } from '../../ranking-ui/ranking-ui.component';


@Component({
  selector: 'app-evictions',
  templateUrl: './evictions.component.html',
  styleUrls: ['./evictions.component.scss']
})
export class EvictionsComponent implements OnInit, AfterViewInit, OnDestroy {

  /** string representing the region */
  @Input()
  set region(regionValue) {
    if (!regionValue) { return; }
    if (regionValue !== this.store.region) {
      console.log('set region', regionValue, this.store.region);
      this.store.region = regionValue;
      this.updateEvictionList();
    }
  }
  get region() { return this.store.region; }

  /** ID representing the selected area type */
  @Input()
  set areaType(newType) {
    if (!newType) { return; }
    if ((!this.store.areaType || newType.value !== this.store.areaType.value) && newType) {
      console.log('set areaType', newType, this.store.areaType);
      this.store.areaType = newType;
      this.updateEvictionList();
    }
  }
  get areaType() { return this.store.areaType; }

  /** object key representing the data property to sort by */
  @Input()
  set dataProperty(newProp) {
    if (!newProp) { return; }
    if ((!this.store.dataProperty || newProp.value !== this.store.dataProperty.value) && newProp) {
      console.log('set dataProp', newProp, this.store.dataProperty);
      this.store.dataProperty = newProp;
      this.updateEvictionList();
    }
  }
  get dataProperty() { return this.store.dataProperty; }

  /** the index of the selected location for the data panel */
  @Input() selectedIndex: number;
  /** tracks if the data has been loaded and parsed */
  isDataReady = false;
  /** A shortened version of `listData`, containing only the first `topCount` items */
  truncatedList: Array<RankingLocation>;
  /** Stores the maximum value in the truncated List */
  dataMax = 1;
  /** list of data for the current UI selections */
  listData: Array<RankingLocation>; // Array of locations to show the rank list for
  /** state for UI panel on mobile / tablet */
  showUiPanel = false;
  /** Boolean of whether to show scroll to top button */
  showScrollButton = false;
  /** number of items to show in the list */
  topCount = 100;
  /** Tweet text */
  tweet: string;
  private store = {
    region: 'United States',
    areaType: this.rankings.areaTypes[0],
    dataProperty: this.rankings.sortProps[0]
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
  private destroy: Subject<any> = new Subject();

  constructor(
    public rankings: RankingService,
    public loader: LoadingService,
    public platform: PlatformService,
    private route: ActivatedRoute,
    private router: Router,
    private scroll: ScrollService,
    private translate: TranslateService,
    private analytics: AnalyticsService,
    private translatePipe: TranslatePipe,
    private decimal: DecimalPipe,
    private changeDetectorRef: ChangeDetectorRef,
    private toast: ToastsManager,
    @Inject(DOCUMENT) private document: any
  ) {
    this.store.areaType = this.rankings.areaTypes[0];
    this.store.dataProperty = this.rankings.sortProps[0];
    this.toast.onClickToast().subscribe(t => this.toast.dismissToast(t));
  }

  ngOnInit() {
    this.loader.start('evictions');
    this.rankings.isReady.takeUntil(this.destroy)
      .subscribe((ready) => {
        this.isDataReady = ready;
        if (ready) {
          this.updateEvictionList();
          this.loader.end('evictions');
        }
      });
  }

  ngAfterViewInit() {
    this.rankings.loadEvictionsData();
  }

  ngOnDestroy() {
    this.rankings.setReady(false);
    this.destroy.next();
    this.destroy.complete();
  }

  /** Update the route when the region changes */
  onRegionChange(newRegion: string) {
    if (this.canNavigate) {
      if (newRegion !== this.region) { this.selectedIndex = null; }
      const params = this.getQueryParams();
      params['region'] = newRegion;
      this.router.navigate(this.getCurrentNavArray(), { queryParams: params });
    }
  }

  /** Update the route when the area type changes */
  onAreaTypeChange(areaType: { name: string, value: number }) {
    if (this.canNavigate) {
      if (this.areaType !== null && areaType.value !== this.areaType.value) {
        this.selectedIndex = null;
      }
      const params = this.getQueryParams();
      params['areaType'] = areaType.value;
      this.router.navigate(this.getCurrentNavArray(), { queryParams: params });
    }
  }

  /** Update the sort property when the area type changes */
  onDataPropertyChange(dataProp: { name: string, value: string }) {
    if (this.canNavigate) {
      if (this.dataProperty !== null && dataProp.value !== this.dataProperty.value) {
        this.selectedIndex = null;
      }
      const params = this.getQueryParams();
      params['dataProperty'] = dataProp.value;
      this.router.navigate(this.getCurrentNavArray(), { queryParams: params });
    }
  }

  /** Update current location */
  setCurrentLocation(locationIndex: number) {
    if (this.canNavigate) {
      const params = this.getQueryParams();
      if (locationIndex || locationIndex === 0) {
        params['selectedIndex'] = locationIndex;
      } else {
        params['selectedIndex'] = null;
      }
      this.router.navigate(this.getCurrentNavArray(), { queryParams: params });
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
    if (this.listData[index][this.dataProperty.value] < 0) {
      this.showUnavailableToast();
    } else {
      this.setCurrentLocation(index);
    }
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

  /**
   * Checks if location is in view, scrolls to it if so
   * @param rank Rank of location
   */
  onPanelLocationClick(rank: number) {
    const query = `.ranking-list > li:nth-child(${rank})`;
    if (rank <= this.topCount && this.document.querySelector(query)) {
      this.scroll.scrollTo(query);
    }
  }

  private showUnavailableToast() {
    this.toast.error(
      this.translatePipe.transform('RANKINGS.LOCATION_DATA_UNAVAILABLE'),
      null,
      {messageClass: 'ranking-error'}
    );
  }

  private getQueryParams() {
    // this.selectedIndex
    const params = {
      lang: this.translate.currentLang,
      region: this.region,
      areaType: this.areaType.value,
      dataProperty: this.dataProperty.value
    };
    if (this.selectedIndex || this.selectedIndex === 0) {
      params['selectedIndex'] = this.selectedIndex;
    }
    return params;
  }

  /**
   * Set default tweet parameters with the US and no location selected, has the
   * following parameters:
   * - areaType: selected area type
   * - action: string representing if it was an eviction or filing
   * - amount: the average of the top 10 if showing rates, otherwise the total of the top 10
   * - year: year for the data
   * - link: link to the view
   */
  private getDefaultTweet(): string {
    // action text
    let action = this.isPropJudgments() ? 'RANKINGS.SHARE_JUDGMENT' : 'RANKINGS.SHARE_FILING';
    action = this.translatePipe.transform(action);
    // add together top 10 for amount
    let amount = this.listData.slice(0, 10).reduce((a, b) => {
      return a + b[this.dataProperty.value];
    }, 0);
    // format number based on if it's a rate or not
    amount = this.isRateValue() ?
      this.decimal.transform(amount / 10, '1.1-2') : this.decimal.transform(amount);
    // add average text if the number is an average rate
    amount = this.isRateValue() ?
      this.translatePipe.transform('RANKINGS.SHARE_AVERAGE', { amount }) : amount;
    return this.translatePipe.transform('RANKINGS.SHARE_DEFAULT', {
      areaType: this.translatePipe.transform(this.areaType.langKey).toLowerCase(),
      action,
      amount,
      year: this.rankings.year,
      link: this.platform.currentUrl()
    });
  }

  /**
   * Creates the tweet string based on the selected location
   */
  private getLocationTweet() {
    const location = this.listData[this.selectedIndex];
    let amount = this.isRateValue() ?
      this.decimal.transform(location[this.dataProperty.value], '1.1-2') :
      this.decimal.transform(location[this.dataProperty.value]);
    amount = this.isRateValue() ?
      this.translatePipe.transform('RANKINGS.SHARE_PERCENT_OF', { amount }) :
      amount;
    const action = this.isPropJudgments() ?
      this.translatePipe.transform('RANKINGS.SHARE_PASSIVE_JUDGMENT') :
      this.translatePipe.transform('RANKINGS.SHARE_PASSIVE_FILING');
    const category = this.isRateValue() ?
      this.translatePipe.transform('RANKINGS.SHARE_RATE') :
      this.translatePipe.transform('RANKINGS.SHARE_TOTAL');
    const ranking =
      `${this.selectedIndex + 1}${this.rankings.ordinalSuffix(this.selectedIndex + 1)}`;
    return this.translatePipe.transform('RANKINGS.SHARE_SELECTION', {
      areaType: this.translatePipe.transform(this.areaType.langKey).toLowerCase(),
      region: this.region,
      year: this.rankings.year,
      amount,
      area: location.name,
      action,
      ranking,
      category,
      link: this.platform.currentUrl()
    });
  }

  /**
   * Creates a tweet for when there is a region selected, but no location
   */
  private getRegionTweet() {
    const action = this.isPropJudgments() ?
      this.translatePipe.transform('RANKINGS.SHARE_PASSIVE_JUDGMENT') :
      this.translatePipe.transform('RANKINGS.SHARE_PASSIVE_FILING');
    const state = this.rankings.stateData.find(s => s.name === this.region);
    let amount = this.isRateValue() ?
      this.decimal.transform(state[this.dataProperty.value], '1.1-2') :
      this.decimal.transform(state[this.dataProperty.value]);
    amount = this.isRateValue() ?
      this.translatePipe.transform('RANKINGS.SHARE_PERCENT_OF', { amount }) :
      amount;
    const hadAmount = this.isRateValue() ?
      this.translatePipe.transform('RANKINGS.SHARE_HAD_RATE') :
      this.translatePipe.transform('RANKINGS.SHARE_HAD_COUNT');
    const topArea = this.listData.length > 0 ?
      this.translatePipe.transform(
        'RANKINGS.SHARE_REGION_TOP_AREA', { topArea: this.listData[0].name, hadAmount }
      ) : '';
    // Translate region amount (since possible that it's unavailable)
    const regionParams = {
      year: this.rankings.year, region: this.region, amount, action
    };
    const regionAmount = (amount || state[this.dataProperty.value] === 0) ?
      this.translatePipe.transform('RANKINGS.SHARE_REGION_AMOUNT', regionParams) :
      this.translatePipe.transform('RANKINGS.SHARE_REGION_UNAVAILABLE', regionParams);
    return this.translatePipe.transform('RANKINGS.SHARE_REGION_NO_SELECTION', {
      regionAmount, topArea, link: this.platform.currentUrl()
    });
  }

  /**
   * Updates Twitter text for city rankings
   */
  getTweet() {
    if (!this.canNavigate || !this.listData) { return ''; }
    return this.isDefaultSelection() ? this.getDefaultTweet() :
      (this.isLocationSelected() ? this.getLocationTweet() : this.getRegionTweet());

  }

  /** Returns true if the data property is eviction judgements */
  private isPropJudgments(): boolean {
    return this.dataProperty.value.startsWith('e');
  }

  /** Returns true if all of the user selections are at their default values */
  private isDefaultSelection(): boolean {
    return this.region === 'United States' &&
      !this.selectedIndex && this.selectedIndex !== 0;
  }

  /** Returns true if a location is selected */
  private isLocationSelected(): boolean {
    return (this.selectedIndex !== null && this.selectedIndex !== undefined);
  }

  /** Returns true if the data property is a rate instead of a count */
  private isRateValue(): boolean {
    return this.dataProperty.value.endsWith('Rate');
  }

  private getCurrentNavArray() {
    const routeArray =  [
      '/',
      'evictions'
    ];
    return routeArray;
  }

    /**
   * Update the list data based on the selected UI properties
   */
  private updateEvictionList() {
    if (this.canRetrieveData) {
      this.tweet = this.getTweet();
      this.listData = this.rankings.getFilteredEvictions(
        this.region, this.areaType.value, this.dataProperty.value
      );
      this.truncatedList = this.listData.slice(0, this.topCount);
      this.dataMax = Math.max.apply(
        Math, this.truncatedList.map(l => {
          return !isNaN(l[this.dataProperty.value]) ? l[this.dataProperty.value] : 0;
        })
      );
      this.changeDetectorRef.detectChanges();
      console.log('got list data:', this.listData, this.truncatedList, this.dataMax);
    } else {
      console.warn('data is not ready yet');
    }
  }
}
