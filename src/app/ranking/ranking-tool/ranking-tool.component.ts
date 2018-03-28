import {
  Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation, ElementRef
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DOCUMENT, DecimalPipe } from '@angular/common';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { RankingLocation } from '../ranking-location';
import { RankingService } from '../ranking.service';
import { ScrollService } from '../../services/scroll.service';
import { LoadingService } from '../../services/loading.service';
import { PlatformService } from '../../services/platform.service';
import { AnalyticsService } from '../../services/analytics.service';
import { RankingUiComponent } from '../ranking-ui/ranking-ui.component';

@Component({
  selector: 'app-ranking-tool',
  templateUrl: './ranking-tool.component.html',
  styleUrls: ['./ranking-tool.component.scss'],
  providers: [TranslatePipe, DecimalPipe],
  encapsulation: ViewEncapsulation.None
})
export class RankingToolComponent implements OnInit, OnDestroy {

  /** identifier for the component so AppComponent can detect type */
  id = 'ranking-tool';
  /** tab ID for the active tab */
  activeTab = 'evictions';
  region;
  areaType;
  dataProperty;
  selectedIndex;

  private ngUnsubscribe: Subject<any> = new Subject();

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

  /** Listen for when the data is ready and for route changes */
  ngOnInit() {
    this.route.url.takeUntil(this.ngUnsubscribe)
      .subscribe(this.onRouteChange.bind(this));
    this.route.queryParams.takeUntil(this.ngUnsubscribe)
      .subscribe(this.onQueryParamChange.bind(this));
  }

  switchTab(id: string) {
    this.router.navigate([ '/', id]);
    return false;
  }

  /**
   * Update data from query params
   * @param params
   */
  onQueryParamChange(params) {
    this.translate.use(params['lang'] || 'en');
    if (this.activeTab === 'evictions') {
      this.region = params['region'];
      this.areaType =
        this.rankings.areaTypes.find(a => a.value === parseInt(params['areaType'], 10));
      this.dataProperty = this.rankings.sortProps.find(p => p.value === params['dataProperty']);
      this.selectedIndex = params['selectedIndex'] ? parseInt(params['selectedIndex'], 10) : null;
    } else if (this.activeTab === 'evictors') {
      this.dataProperty = this.rankings.sortProps.find(p => p.value === params['dataProperty']);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * When the route changes, update the selected properties with the values
   * in the route, and then update the list data
   */
  onRouteChange(url) {
    if (this.activeTab !== url[0].path) {
      this.activeTab = url[0].path;
    }
  }

}
