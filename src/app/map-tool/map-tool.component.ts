import {
  Component, ChangeDetectorRef, OnInit, OnDestroy, AfterViewInit, ViewChild, Inject,
  HostListener, ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/combineLatest';
import {scaleLinear} from 'd3-scale';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

import { LoadingService } from '../services/loading.service';
import { MapFeature } from './map/map-feature';
import { MapComponent } from './map/map/map.component';
import { MapToolService } from './map-tool.service';
import { PlatformService } from '../services/platform.service';
import { UiDialogService } from '../ui/ui-dialog/ui-dialog.service';
import { RoutingService } from '../services/routing.service';
import { environment } from '../../environments/environment';
import { AnalyticsService } from '../services/analytics.service';
import { ScrollService } from '../services/scroll.service';
import { FeatureOverviewComponent } from './feature-overview/feature-overview.component';

@Component({
  selector: 'app-map-tool',
  templateUrl: './map-tool.component.html',
  styleUrls: ['./map-tool.component.scss'],
  providers: [ TranslatePipe ]
})
export class MapToolComponent implements OnInit, OnDestroy, AfterViewInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild(MapComponent) map;
  @ViewChild('divider') dividerEl: ElementRef;
  id = 'map-tool';
  enableZoom = true; // controls if map scroll zoom is enabled
  wheelEvent = false; // tracks if there is an active wheel event
  currentRoute = [];
  verticalOffset; // stores the amount the page has scrolled
  panelOffset: number; // tracks the vertical offset to the data panel
  offsetToTranslate; // function that maps vertical offset to the
  activeMenuItem; // tracks the active menu item on mobile
  helpData: string; // translated title / content for help dialog.
  private defaultMapConfig = {
    style: `${environment.deployUrl}assets/style.json`,
    center: [-98.5795, 39.8283],
    zoom: 3,
    minZoom: 2,
    maxZoom: 15
  };

  constructor(
    public loader: LoadingService,
    public mapToolService: MapToolService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private routing: RoutingService,
    private scroll: ScrollService,
    private translate: TranslateService,
    private translatePipe: TranslatePipe,
    private toast: ToastsManager,
    private platform: PlatformService,
    private dialogService: UiDialogService,
    private analytics: AnalyticsService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.initMapToolData();
    this.routing.setActivatedRoute(route);
    // Add click to dimiss to all toast messages
    this.toast.onClickToast().subscribe(t => this.toast.dismissToast(t));
    this.mapToolService.loadUSAverage();
  }

  ngOnInit() {
    this.setupPageScroll();
    // Set data from the route on init
    this.routing.getMapRouteData().take(1)
      .subscribe((data) => this.mapToolService.setCurrentData(data));
    // Subscribe to language changes and store translated help content
    this.translate.onLangChange.takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.updateRoute();
    });
    // Check device support for map once language has loaded
    this.translate.getTranslation(this.translate.currentLang)
      .take(1).subscribe(() => { this.checkSupport(); });
    // Reset VH transition only on width changes
    this.platform.dimensions$.distinctUntilChanged((prev, next) => {
      return prev.width === next.width;
    }).skip(1).subscribe(this.resetVhTransition.bind(this));
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Set the panel offset when the divider element is present
   */
  ngAfterViewInit() {
    this.panelOffset = this.dividerEl.nativeElement.getBoundingClientRect().bottom;
  }

  /**
   * Update the position of the data panel on window resize
   * @param e resize event
   */
  @HostListener('window:resize', [ '$event' ])
  onResize(e) {
    this.panelOffset =
      this.verticalOffset + this.dividerEl.nativeElement.getBoundingClientRect().bottom;
  }

  /** Checks if the map features are supported (currently just WebGL) and shows a dialog if not */
  checkSupport() {
    if (!this.platform.hasWebGLSupport) {
      const title = this.translatePipe.transform('MAP.UNSUPPORTED_TITLE');
      const data = this.translatePipe.transform('MAP.UNSUPPORTED_MESSAGE');
      return this.dialogService.showDialog({
        title: title,
        content: [{ type: 'html', data: data }],
        buttons: { ok: true, cancel: false }
      });
    }
  }

  /**
   * Accepts a clicked feature, queries tile data to get data across all years
   * @param feature returned from featureClick event
   */
  onFeatureSelect(feature: MapFeature) {
    // Exit function if currently embedded
    if (this.mapToolService.embed) { return; }
    const featureLonLat = this.mapToolService.getFeatureLonLat(feature);
    this.loader.start('feature');
    const maxLocations = this.mapToolService.addLocation(feature);
    if (maxLocations) {
      this.toast.error(this.translatePipe.transform('MAP.MAX_LOCATIONS_ERROR'));
    }
    // track event
    const selectEvent = {
      locationSelected: this.mapToolService.getFullLocationName(feature),
      locatonSelectedLevel: feature.properties.layerId,
      locationFindingMethod: 'map',
      combinedSelections: this.mapToolService.getCurrentDataString()
    };
    this.analytics.trackEvent('locationSelection', selectEvent);
    // pull full data for the location
    this.mapToolService.getTileData(feature.properties['GEOID'] as string, featureLonLat, true)
      .subscribe(data => {
        this.mapToolService.updateLocation(data);
        this.updateRoute();
        this.loader.end('feature');
      });
  }

  /** Updates the map tool route */
  updateRoute() {
    this.routing.updateRouteData(this.mapToolService.getCurrentData());
  }

  onBubbleChange(bubble: any) {
    // if bubble has no name, tool hasn't initialized yet
    if (bubble.name) {
      this.analytics.trackEvent('evictionDataSelection', {
        evictionDataType: bubble.langKey,
        combinedSelections: this.mapToolService.getCurrentDataString()
      });
      this.updateRoute();
    }
  }

  onChoroplethChange(choropleth: any) {
    // if choropleth has no name, tool hasn't initialized yet
    if (choropleth.name) {
      this.analytics.trackEvent('censusDataSelection', {
        evictionDataType: choropleth.langKey,
        combinedSelections: this.mapToolService.getCurrentDataString()
      });
      this.updateRoute();
    }
  }

  onGeographyChange(geography: any) {
    // if geography has no name, tool hasn't initialized yet
    if (geography.name) { this.updateRoute(); }
  }

  trackLevelSelection(geography: any) {
    this.analytics.trackEvent('mapLevelSelection', {
      mapLevel: geography.langKey,
      combinedSelections: this.mapToolService.getCurrentDataString()
    });
  }

  /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   * @param updateMap moves the map to the selected location if true
   */
  onSearchSelect(searchData: any, updateMap = true) {
    const feature: MapFeature = searchData.feature;
    if (feature) {
      this.loader.start('search');
      const layerId = feature.properties['layerId'] as string;
      this.mapToolService.getSearchTileData(feature).subscribe(data => {
        if (!data.properties.n) {
          this.toast.error(this.translatePipe.transform('MAP.NO_DATA_ERROR'));
        } else {
          this.mapToolService.addLocation(data);
        }
        const dataLevel = this.mapToolService.dataLevels.filter(l => l.id === layerId)[0];
        if (updateMap) {
          if (feature.hasOwnProperty('bbox')) {
            this.mapToolService.activeMapView = feature['bbox'];
          } else {
            this.map.zoomToPointFeature(feature);
          }
          // Wait for map to be done loading, then set data layer
          this.map.map.isLoading$.distinctUntilChanged()
            .debounceTime(500)
            .filter(state => !state)
            .first()
            .subscribe((state) => this.map.setGroupVisibility(dataLevel));
        }
        this.loader.end('search');
      });
    }
  }

  /**
   * Set map layer and view from clicked location card header
   * @param feature clicked feature from card
   */
  onCardHeaderClick(feature: MapFeature) {
    const layerId = feature.properties['layerId'];
    const dataLevel = this.mapToolService.dataLevels.filter(l => l.id === layerId)[0];
    this.map.setGroupVisibility(dataLevel);
    if (feature.hasOwnProperty('bbox')) {
      this.map.zoomToBoundingBox(feature.bbox);
    } else {
      this.map.zoomToPointFeature(feature);
    }
  }

  /**
   * Triggers a scroll to the top of the page
   */
  goToTop() {
    if (this.scroll.getVerticalOffset() > 0) {
      const topEl = this.document.getElementById('top');
      this.scroll.scrollTo('#top', { pageScrollOffset: topEl.offsetTop });
    }
  }

  /**
   * Triggers a scroll to the data panel
   */
  goToDataPanel(feature) {
    // track event
    this.analytics.trackEvent('viewMoreData');
    // animate scroll to data panel
    this.scroll.scrollTo('#data-panel');
  }

  showFeatureOverview() {
    return this.dialogService.showDialog(
      { options: { class: 'feature-overview-dialog' } }, FeatureOverviewComponent
    );
  }

  /**
   * Configures the data service with any static data passed through the route
   */
  private initMapToolData() {
    // Set default zoom to 2 on mobile
    if (this.platform.isMobile && this.defaultMapConfig) {
      this.defaultMapConfig.zoom = 2;
    }
    this.mapToolService.mapConfig = this.defaultMapConfig;
    if (environment.hasOwnProperty('maxYear')) {
      this.mapToolService.activeYear = environment.maxYear;
    }
  }

  /**
   * Configures options for the `ng2-page-scroll` module, and setup scroll observables
   * to enable / disable map zoom
   */
  private setupPageScroll() {
    // Setup scroll events to handle enable / disable map zoom
    Observable.fromEvent(this.document, 'wheel')
      .debounceTime(250)
      .subscribe(e => this.onWheel());
    Observable.fromEvent(this.document, 'wheel')
      .throttleTime(50)
      // only fire when wheel event hasn't been triggered yet
      .filter(() => !this.wheelEvent)
      .subscribe(e => this.wheelEvent = true);
    this.scroll.verticalOffset$.subscribe(this.onScroll.bind(this));
  }

  /**
   * Debounced wheel event on the document, enable zoom
   * if the document is scrolled to the top at the end of
   * the wheel events
   */
  private onWheel() {
    this.verticalOffset = this.scroll.getVerticalOffset();
    this.wheelEvent = false;
    this.enableZoom = (this.verticalOffset === 0);
  }

  /**
   * If scrolled to the top, enable the zoom.  Unless
   * there is a wheel event currently happening.
   */
  private onScroll(yOffset: number) {
    this.verticalOffset = yOffset;
    if (!this.wheelEvent) {
      this.enableZoom = (this.verticalOffset === 0);
    } else {
      this.enableZoom = false;
    }
  }

  /**
   * Toggle mobile vh transition to force a height change on resize
   */
  private resetVhTransition() {
    this.map.el.nativeElement.style.transition = 'none';
    this.map.el.nativeElement.style.height = '100vh';
    setTimeout(() => {
      this.map.el.nativeElement.style.height = null;
      setTimeout(() => this.map.el.nativeElement.style.transition = null);
    }, 350);
  }

}
