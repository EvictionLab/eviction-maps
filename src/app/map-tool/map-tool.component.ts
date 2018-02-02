import {
  Component, ChangeDetectorRef, OnInit, AfterViewInit, ViewChild, Inject, HostListener, ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/combineLatest';
import {scaleLinear} from 'd3-scale';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

import { LoadingService } from '../loading.service';
import { MapFeature } from './map/map-feature';
import { MapComponent } from './map/map/map.component';
import { MapToolService } from './map-tool.service';
import { PlatformService } from '../platform.service';
import { UiDialogService } from '../ui/ui-dialog/ui-dialog.service';
import { RoutingService } from '../routing.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-map-tool',
  templateUrl: './map-tool.component.html',
  styleUrls: ['./map-tool.component.scss']
})
export class MapToolComponent implements OnInit, AfterViewInit {
  @ViewChild(MapComponent) map;
  @ViewChild('divider') dividerEl: ElementRef;
  title = 'Eviction Lab - Map';
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
    style: './assets/style.json',
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
    private pageScrollService: PageScrollService,
    private translate: TranslateService,
    private toast: ToastsManager,
    private platform: PlatformService,
    private dialogService: UiDialogService,
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
    this.translate.onLangChange.subscribe(() => {
      this.updateRoute();
      this.translate.get(['HELP.TITLE', 'HELP.CONTENT']).take(1)
        .subscribe((res: string) => this.helpData = res);
    });
    this.cdRef.detectChanges();
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
      this.toast.error(
        'Maximum limit reached. Please remove a location to add another.'
      );
    }
    this.mapToolService.getTileData(feature['layer']['id'], featureLonLat, null, true)
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

  /**
   * Shows the help dialog with data loaded from i18n
   */
  showHelpDialog() {
    return this.dialogService.showDialog({
      title: this.helpData['HELP.TITLE'],
      content: [{ type: 'html', data: this.helpData['HELP.CONTENT'] }]
    });
  }

  /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   * @param updateMap moves the map to the selected location if true
   */
  onSearchSelect(feature: MapFeature | null, updateMap = true) {
    if (feature) {
      this.loader.start('search');
      const layerId = feature.properties['layerId'] as string;
      this.mapToolService.getTileData(
        layerId, feature.geometry['coordinates'], feature.properties['name'] as string, true
      ).subscribe(data => {
          if (!data.properties.n) {
            this.toast.error('Could not find data for location.');
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
    const pageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#top');
    this.pageScrollService.start(pageScrollInstance);
  }

  /**
   * Triggers a scroll to the data panel
   */
  goToDataPanel(feature) {
    const pageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#data-panel');
    this.pageScrollService.start(pageScrollInstance);
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

  private getVerticalOffset() {
    return this.platform.nativeWindow.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop || 0;
  }

  /**
   * Configures options for the `ng2-page-scroll` module, and setup scroll observables
   * to enable / disable map zoom
   */
  private setupPageScroll() {
    PageScrollConfig.defaultScrollOffset = 120;
    PageScrollConfig.defaultDuration = 1000;
    // easing function pulled from:
    // https://joshondesign.com/2013/03/01/improvedEasingEquations
    PageScrollConfig.defaultEasingLogic = {
        ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
    };

    // Setup scroll events to handle enable / disable map zoom
    Observable.fromEvent(this.document, 'wheel')
      .debounceTime(250)
      .subscribe(e => this.onWheel());
    Observable.fromEvent(this.document, 'wheel')
      .throttleTime(50)
      // only fire when wheel event hasn't been triggered yet
      .filter(() => !this.wheelEvent)
      .subscribe(e => this.wheelEvent = true);
    Observable.fromEvent(this.platform.nativeWindow, 'scroll')
      // trailing scroll event is needed so verticalOffset = 0 event is fired
      .throttleTime(10, undefined, { trailing: true, leading: true })
      .subscribe(e => this.onScroll());
  }

  /**
   * Debounced wheel event on the document, enable zoom
   * if the document is scrolled to the top at the end of
   * the wheel events
   */
  private onWheel() {
    this.verticalOffset = this.getVerticalOffset();
    this.wheelEvent = false;
    this.enableZoom = (this.verticalOffset === 0);
  }

  /**
   * If scrolled to the top, enable the zoom.  Unless
   * there is a wheel event currently happening.
   */
  private onScroll() {
    this.verticalOffset = this.getVerticalOffset();
    if (!this.wheelEvent) {
      this.enableZoom = (this.verticalOffset === 0);
    } else {
      this.enableZoom = false;
    }
  }

}
