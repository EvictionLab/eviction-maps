import {
  Component, OnInit, Input, OnDestroy, ViewChild, Inject, AfterViewInit, ChangeDetectorRef,
  HostListener, Output, EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

import { environment } from '../../../../environments/environment';
import { RankingLocation } from '../../ranking-location';
import { RankingService } from '../../ranking.service';
import { ScrollService } from '../../../services/scroll.service';
import { LoadingService } from '../../../services/loading.service';
import { PlatformService } from '../../../services/platform.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { RankingUiComponent } from '../../ranking-ui/ranking-ui.component';
import { RankingListComponent } from '../../ranking-list/ranking-list.component';
import { RankingPanelComponent } from '../../ranking-panel/ranking-panel.component';


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
  @Input()
  set selectedIndex(value: number) {
    const panelOpened = this.store.selectedIndex === null;
    this.store.selectedIndex = value;
    // location exists in the current list, set active and scroll to it
    if (value !== null && value < this.topCount) { this.scrollToIndex(value); }
    // if the panel is newly opened, focus
    if (panelOpened) { this.focusPanel(); }
    this.updateTweet();
  }
  get selectedIndex(): number { return this.store.selectedIndex; }
  /** Reference to the ranking list component */
  @ViewChild(RankingListComponent) rankingList: RankingListComponent;
  /** Reference to the ranking panel component */
  @ViewChild(RankingPanelComponent) rankingPanel: RankingPanelComponent;
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
    dataProperty: this.rankings.sortProps[0],
    selectedIndex: null
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
  private _debug = true;

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

  /** subscribe to when the rankings data is ready, show loading */
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

  /** load data once the view has been initialized */
  ngAfterViewInit() {
    this.rankings.loadEvictionsData();
    // list takes a bit to render, so setup page scroll in a timeout instead
    setTimeout(() => { this.setupPageScroll(); }, 500);
  }

  /** clear any subscriptions on destroy */
  ngOnDestroy() {
    this.rankings.setReady(false);
    this.destroy.next();
    this.destroy.complete();
  }

  /** Move to previous or next location with arrows, hide panel with escape */
  @HostListener('keydown', ['$event']) onKeypress(e) {
    if (this.selectedIndex === null) { return; }
    if ((e.keyCode === 37 || e.keyCode === 39)) {
      // left or right
      const newValue = (e.keyCode === 37) ? this.selectedIndex - 1 : this.selectedIndex + 1;
      this.setCurrentLocation(Math.min(Math.max(0, newValue), this.topCount));
    }
    if (e.keyCode === 27) {
      // escape
      this.onClose();
      e.preventDefault();
    }
  }

  /** Updates one of the query parameters and updates the route */
  updateQueryParam(paramName: string, value: any) {
    if (!this.canNavigate) { return; }
    if (paramName === 'region' || paramName === 'areaType' || paramName === 'dataProperty') {
      this.selectedIndex = null;
    }
    const params = this.getQueryParams();
    params[paramName] = value;
    this.router.navigate([ '/', 'evictions' ], { queryParams: params });
  }

  /** Update the route when the region changes */
  onRegionChange(newRegion: string) {
    if (newRegion === this.region) { return; }
    this.updateQueryParam('region', newRegion);
  }

  /** Update the route when the area type changes */
  onAreaTypeChange(areaType: { name: string, value: number }) {
    if (this.areaType && areaType.value === this.areaType.value) { return; }
    this.updateQueryParam('areaType', areaType.value);
  }

  /** Update the sort property when the area type changes */
  onDataPropertyChange(dataProp: { name: string, value: string }) {
    if (this.dataProperty && dataProp.value === this.dataProperty.value) { return; }
    this.updateQueryParam('dataProperty', dataProp.value);
  }

  /** Update current location, shows toast if data unavailable */
  setCurrentLocation(locationIndex: number) {
    if (this.selectedIndex === locationIndex) { return; }
    if (locationIndex !== null && this.listData[locationIndex][this.dataProperty.value] < 0) {
      this.showUnavailableToast();
      return;
    }
    const value = (locationIndex || locationIndex === 0) ? locationIndex : null;
    this.updateQueryParam('selectedIndex', value);
  }

  /**
   * Scrolls to the searched location if it exists in the list
   * or switches to the corresponding area type for the location and activates
   * the location
   * @param location
   */
  onSearchSelectLocation(location: RankingLocation | null) {
    if (location === null) { return this.setCurrentLocation(null); }
    this.showUiPanel = false;
    let listIndex = this.listData.findIndex(d => d.geoId === location.geoId);
    if (listIndex > -1) {
      this.setCurrentLocation(listIndex);
    } else {
      // location doesn't exist in the list, update to full list and find the location
      this.region = 'United States';
      this.areaType = this.rankings.areaTypes.filter(t => t.value === location.areaType)[0];
      this.updateEvictionList();
      listIndex = this.listData.findIndex(d => d.geoId === location.geoId);
      this.setCurrentLocation(listIndex);
    }
  }

  /** handles the click on a specific location */
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
    this.scrollToIndex(this.selectedIndex, true);
    this.setCurrentLocation(null);
  }

  /**
   * Checks if location is in view, scrolls to it if so
   * @param rank Rank of location
   */
  onPanelLocationClick(rank: number) {
    this.scrollToIndex(rank - 1);
  }

  /** Updates Twitter text for city rankings based on selections */
  updateTweet() {
    if (!this.canNavigate || !this.listData) { return ''; }
    this.tweet = this.isDefaultSelection() ? this.getDefaultTweet() :
      (this.isLocationSelected() ? this.getLocationTweet() : this.getRegionTweet());
    this.debug('updated tweet: ', this.tweet);
  }

  scrollToTop() {
    this.scroll.scrollTo(this.rankingList.el.nativeElement);
    // set focus to an element at the top of the page for keyboard nav
    const focusableEl = this.rankingList.el.nativeElement.querySelector('app-ranking-list button');
    setTimeout(() => {
      if (focusableEl.length) {
        focusableEl[0].focus();
        focusableEl[0].blur();
      }
    }, this.scroll.defaultDuration);
  }

  private setupPageScroll() {
    this.scroll.defaultScrollOffset = 0;
    this.scroll.verticalOffset$
      .map(offset => offset > 600)
      .distinctUntilChanged()
      .subscribe(showButton => {
        this.debug('show scroll to top button:', showButton);
        this.showScrollButton = showButton;
      });
  }

  /** Shows a toast message indicating the data is not available */
  private showUnavailableToast() {
    this.toast.error(
      this.translatePipe.transform('RANKINGS.LOCATION_DATA_UNAVAILABLE'),
      null,
      {messageClass: 'ranking-error'}
    );
  }

  /** gets the query parameters for the current view */
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
      this.cappedRateValue(amount / 10) : this.decimal.transform(amount);
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
      this.cappedRateValue(location[this.dataProperty.value]) :
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
      this.cappedRateValue(state[this.dataProperty.value]) :
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

  /** Sets the focus on the first button in the rankings panel */
  private focusPanel() {
    if (!this.rankingPanel || !this.rankingPanel.el) { return; }
    // use a timeout, the buttons are not immediately available
    setTimeout(() => {
      const buttons = this.rankingPanel.el.nativeElement.getElementsByTagName('button');
      if (buttons.length) {
        buttons[0].focus();
      }
    }, 500);
  }

  /** Scrolls to an item in the list and optionally sets focus */
  private scrollToIndex(index: number, focus = false) {
    if (!this.rankingList || !this.rankingList.el) { return; }
    // set focus back to the list item
    const listItems = this.rankingList.el.nativeElement.getElementsByTagName('button');
    if (listItems.length > index) {
      this.scroll.scrollTo(listItems[index]);
      if (focus) { listItems[index].focus(); }
    }
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

  /** Returns the formatted rate number, with >100 instead of values over */
  private cappedRateValue(val: number): string {
    return val > 100 ? '>100' : this.decimal.transform(val, '1.1-2');
  }

    /**
   * Update the list data based on the selected UI properties
   */
  private updateEvictionList() {
    if (this.canRetrieveData) {
      this.listData = this.rankings.getFilteredEvictions(
        this.region, this.areaType.value, this.dataProperty.value
      );
      this.truncatedList = this.listData.slice(0, this.topCount);
      this.dataMax = Math.max.apply(
        Math, this.truncatedList.map(l => {
          return !isNaN(l[this.dataProperty.value]) ? l[this.dataProperty.value] : 0;
        })
      );
      this.updateTweet();
      this.changeDetectorRef.detectChanges();
    } else {
      console.warn('data is not ready yet');
    }
  }

  private debug(...args) {
    // tslint:disable-next-line
    environment.production || !this._debug ? null : console.debug.apply(console, args);
  }
}
