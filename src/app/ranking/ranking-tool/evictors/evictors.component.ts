import {
  Component, OnInit, Input, OnDestroy, ViewChild, Inject, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { RankingLocation } from '../../ranking-location';
import { RankingService, RankingEvictor } from '../../ranking.service';
import { ScrollService } from '../../../services/scroll.service';
import { LoadingService } from '../../../services/loading.service';
import { PlatformService } from '../../../services/platform.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { RankingUiComponent } from '../../ranking-ui/ranking-ui.component';


@Component({
  selector: 'app-evictors',
  templateUrl: './evictors.component.html',
  styleUrls: ['./evictors.component.scss']
})
export class EvictorsComponent implements OnInit, OnDestroy, AfterViewInit {

  /** string representing the region */
  @Input()
  set place(value) {
    if (value !== this.store.place) {
      this.store.place = value;
      this.updateEvictorsList();
    }
  }
  get place() { return this.store.place; }

  /** object key representing the data property to sort by */
  @Input()
  set dataProperty(newProp) {
    if (!newProp) { return; }
    if (!this.store.dataProperty || newProp.value !== this.store.dataProperty.value) {
      this.store.dataProperty = newProp;
      this.updateEvictorsList();
    }
  }
  get dataProperty() { return this.store.dataProperty; }

  /** tracks if the data has been loaded and parsed */
  isDataReady = false;
  /** A shortened version of `listData`, containing only the first `topCount` items */
  truncatedList: Array<RankingEvictor>;
  /** Stores the maximum value in the truncated List */
  dataMax = 1;
  /** full list of sorted data from rankings */
  fullData: Array<RankingEvictor>;
  /** list of data for the current UI selections */
  listData: Array<RankingEvictor>; // Array of locations to show the rank list for
  /** state for UI panel on mobile / tablet */
  showUiPanel = false;
  /** number of items to show in the list */
  topCount = 100;
  private store = {
    place: '',
    dataProperty: null
  };
  /** returns if all of the required params are set to be able to fetch data */
  get canRetrieveData(): boolean {
    return this.canNavigate && this.isDataReady;
  }
  private get canNavigate(): boolean {
    return this.dataProperty && this.dataProperty.hasOwnProperty('value');
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
    @Inject(DOCUMENT) private document: any
  ) {
    this.store.dataProperty = this.rankings.sortProps[0];
  }

  ngOnInit() {
    this.loader.start('evictors');
    this.rankings.isReady.takeUntil(this.destroy)
      .subscribe((ready) => {
        this.isDataReady = ready;
        if (ready) {
          this.updateEvictorsList();
          this.loader.end('evictors');
        }
      });
  }

  ngAfterViewInit() {
    this.rankings.loadEvictorsData();
  }

  ngOnDestroy() {
    this.rankings.setReady(false);
    this.destroy.next();
    this.destroy.complete();
  }

  /** Update the route when the place changes */
  onPlaceChange(newPlace: string) {
    if (this.canNavigate) {
      // const newLocation = this.getCurrentNavArray();
      // newLocation[3] = newPlace;
      // this.router.navigate(newLocation, { queryParams: this.getQueryParams() });
    }
  }

  /** Update the sort property when the area type changes */
  onDataPropertyChange(dataProp: { value: string }) {
    if (this.canNavigate) {
      const params = this.getQueryParams();
      params['dataProperty'] = dataProp.value;
      this.router.navigate(this.getCurrentNavArray(), { queryParams: params });
    }
  }

  onSearchSelectLocation() {
    // handle search
  }

  private getQueryParams() {
    return {
      lang: this.translate.currentLang,
      dataProperty: this.dataProperty
    };
  }

  /**
   * Updates Twitter text for city rankings
   */
  private getEncodedTweet() {
    const tweet = '';
    return this.platform.urlEncode(tweet);
  }

  private getCurrentNavArray() {
    return [ '/', 'evictors' ];
  }

  /**
   * Update the list data based on the selected UI properties
   */
  private updateEvictorsList() {
    if (this.canRetrieveData) {
      this.listData = this.rankings.getFilteredEvictors(null, this.dataProperty.value);
      this.truncatedList = this.listData.slice(0, this.topCount);
      this.dataMax = Math.max.apply(
        Math, this.truncatedList.map(l => {
          return !isNaN(l[this.dataProperty.value]) ? l[this.dataProperty.value] : 0;
        })
      );
      console.log('got list data:', this.listData, this.truncatedList, this.dataMax);
      // Setup full data and scroll if initial data load
      if (!this.fullData) {
        this.fullData = this.rankings.getSortedEvictors(this.dataProperty.value);
      }
    } else {
      console.warn('data is not ready yet');
    }
  }
}
