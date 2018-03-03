import { Component, OnInit, Input, OnDestroy, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { RankingLocation } from '../../ranking-location';
import { RankingService } from '../../ranking.service';
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
export class EvictorsComponent implements OnInit {

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
    if (newProp !== this.store.dataProperty) {
      this.store.dataProperty = newProp;
      this.updateEvictorsList();
    }
  }
  get dataProperty() { return this.store.dataProperty; }

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
  /** number of items to show in the list */
  topCount = 100;
  private store = {
    place: 'United States',
    dataProperty: null
  };
  /** returns if all of the required params are set to be able to fetch data */
  get canRetrieveData(): boolean {
    return this.canNavigate && this.isDataReady;
  }
  private get canNavigate(): boolean {
    return this.place && this.dataProperty &&
      this.dataProperty.hasOwnProperty('value');
  }

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
  ) { }

  ngOnInit() {
    this.loader.start('evictors');
    this.rankings.isReady.subscribe((ready) => {
      this.isDataReady = ready;
      if (ready) {
        // this.updateEvictorsList();
        this.loader.end('evictors');
      }
    });
  }

  /** Update the route when the place changes */
  onPlaceChange(newPlace: string) {
    if (this.canNavigate) {
      const newLocation = this.getCurrentNavArray();
      newLocation[2] = newPlace;
      this.router.navigate(newLocation, { queryParams: this.getQueryParams() });
    }
  }

  /** Update the sort property when the area type changes */
  onDataPropertyChange(dataProp: { name: string, value: string }) {
    if (this.canNavigate) {
      const newLocation = this.getCurrentNavArray();
      newLocation[4] = dataProp.value;
      this.router.navigate(newLocation, { queryParams: this.getQueryParams() });
    }
  }

  onSearchSelectLocation() {
    // handle search
  }

  /**
   * Tracks when the rankings are shared
   */
  trackShare(shareType: string) {
    this.analytics.trackEvent('rankingShare', { shareType });
  }

  /** Handler for when the twitter icon is clicked */
  shareTwitter() {
    this.trackShare('twitter');
    const href = 'http://twitter.com/intent/tweet?status=' + this.getEncodedTweet();
    this.platform.nativeWindow.open(href, 'Social Share', 'height=285,width=550,resizable=1');
  }

  private getQueryParams() {
    return { lang: this.translate.currentLang };
  }

  /**
   * Updates Twitter text for city rankings
   */
  private getEncodedTweet() {
    const tweet = '';
    return this.platform.urlEncode(tweet);
  }

  private getCurrentNavArray() {
    return [ '/', 'evictors', this.place, this.dataProperty.value ];
  }

  /**
   * Update the list data based on the selected UI properties
   */
  private updateEvictorsList() {
    if (this.canRetrieveData) {
      // update list based on selections
    } else {
      console.warn('data is not ready yet');
    }
  }
}
