import {
  Component, ChangeDetectorRef, OnInit, AfterViewInit, ViewChild, Inject, HostListener, ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/combineLatest';
import {scaleLinear} from 'd3-scale';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { ToastsManager, ToastOptions } from 'ng2-toastr';

import { LoadingService } from '../loading.service';
import { MapFeature } from './map/map-feature';
import { MapComponent } from './map/map/map.component';
import { DataService } from '../data/data.service';
import { PlatformService } from '../platform.service';

@Component({
  selector: 'app-map-tool',
  templateUrl: './map-tool.component.html',
  styleUrls: ['./map-tool.component.scss']
})
export class MapToolComponent implements OnInit, AfterViewInit {
  title = 'Eviction Lab - Map';
  id = 'map-tool';
  enableZoom = true; // controls if map scroll zoom is enabled
  wheelEvent = false; // tracks if there is an active wheel event
  currentRoute = [];
  verticalOffset; // stores the amount the page has scrolled
  panelOffset: number; // tracks the vertical offset to the data panel
  offsetToTranslate; // function that maps vertical offset to the
  activeMenuItem; // tracks the active menu item on mobile
  @ViewChild(MapComponent) map;
  @ViewChild('divider') dividerEl: ElementRef;
  urlParts;

  constructor(
    public loader: LoadingService,
    public dataService: DataService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private pageScrollService: PageScrollService,
    private translate: TranslateService,
    private toast: ToastsManager,
    private platform: PlatformService,
    private element: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) {
    translate.onLangChange.subscribe((lang) => this.updateRoute());
    // Add click to dimiss to all toast messages
    this.toast.onClickToast()
      .subscribe(t => this.toast.dismissToast(t));
  }

  ngOnInit() {
    this.configurePageScroll();
    this.route.url.subscribe((url) => { this.urlParts = url; });
    this.route.data.take(1).subscribe(this.setMapToolData.bind(this));
    Observable.combineLatest(
      this.route.params, this.route.queryParams, (params, queryParams) => ({ params, queryParams })
    ).take(1).subscribe(this.setRouteParams.bind(this));

    // Pull first ten events from wheel and scroll, then debounce
    const debounceWheel = Observable.fromEvent(this.element.nativeElement, 'wheel')
      .debounceTime(250);
    const debounceDocWheel = Observable.fromEvent(this.document, 'wheel')
      .debounceTime(250);
    const debounceScroll = Observable.fromEvent(window, 'scroll')
      .debounceTime(250);

    Observable.fromEvent(this.element.nativeElement, 'wheel')
      .take(10).concat(debounceWheel)
      .subscribe(e => this.onBeginWheel());

    Observable.fromEvent(this.document, 'wheel')
      .take(10).concat(debounceDocWheel)
      .subscribe(e => this.onWheel());

    Observable.fromEvent(window, 'scroll')
      .take(10).concat(debounceScroll)
      .subscribe(e => this.onscroll(e));
  }

  /**
   * Set the panel offset when the divider element is present
   */
  ngAfterViewInit() {
    this.panelOffset = this.dividerEl.nativeElement.getBoundingClientRect().bottom;
    this.setOffsetToTranslate();
  }

  /**
   * Debounced wheel event on the document, enable zoom
   * if the document is scrolled to the top at the end of
   * the wheel events
   */
  onWheel() {
    if (typeof this.verticalOffset === 'undefined') {
      this.verticalOffset = this.getVerticalOffset();
    }
    this.wheelEvent = false;
    this.enableZoom = (this.verticalOffset === 0);
  }

  /**
   * Update the position of the data panel on window resize
   * @param e resize event
   */
  @HostListener('window:resize', [ '$event' ])
  onresize(e) {
    this.panelOffset =
      this.verticalOffset + this.dividerEl.nativeElement.getBoundingClientRect().bottom;
    this.setOffsetToTranslate();
  }

  /**
   * Configures the data service based on any route parameters
   */
  setRouteParams(paramObj: Object) {
    const params = paramObj['params'];
    const queryParams = paramObj['queryParams'];

    if (params['year']) {
      this.dataService.activeYear = params['year'];
    }
    if (params['geography']) {
      const geo = params['geography'];
      if (geo !== 'auto') {
        this.dataService.setGeographyLevel(geo);
      }
    }
    if (params['bounds']) {
      const b = params['bounds'].split(',');
      if (b.length === 4) {
        this.dataService.setMapBounds(b);
      }
    }

    this.translate.use(queryParams['lang'] || 'en');
    if (queryParams['choropleth']) {
      this.dataService.setChoroplethHighlight(queryParams['choropleth']);
    }
    if (queryParams['type']) {
      this.dataService.setBubbleHighlight(queryParams['type']);
    }
    if (queryParams['locations']) {
      const locations = this.getLocationsFromString(queryParams['locations']);
      this.dataService.setLocations(locations);
    }

    this.cdRef.detectChanges();
  }

  /**
   * Configures the data service with any static data passed through the route
   */
  setMapToolData(data) {
    // Set default zoom to 2 on mobile
    if (this.platform.isMobile) {
      data.mapConfig.zoom = 2;
    }
    this.dataService.mapConfig = data.mapConfig;
    if (data.hasOwnProperty('year')) {
      this.dataService.activeYear = data.year;
    }
  }

  /** Update route if it has changed */
  updateRoute() {
    if (this.urlParts && this.urlParts.length && this.urlParts[0].path !== 'editor') {
      setTimeout(() => {
        this.router.navigate(this.dataService.getRouteArray(), {
          replaceUrl: true, queryParams: this.dataService.getQueryParameters()
        });
      });
    }
  }

  /**
   * Accepts a clicked feature, queries tile data to get data across all years
   * @param feature returned from featureClick event
   */
  onFeatureSelect(feature: MapFeature) {
    const featureLonLat = this.dataService.getFeatureLonLat(feature);
    this.loader.start('feature');
    const maxLocations = this.dataService.addLocation(feature);
    if (maxLocations) {
      this.toast.error(
        'Maximum limit reached. Please remove a location to add another.'
      );
    }
    this.dataService.getTileData(feature['layer']['id'], featureLonLat, null, true)
      .subscribe(data => {
        this.dataService.updateLocation(data);
        this.updateRoute();
        this.loader.end('feature');
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
      const layerId = feature.properties['layerId'];
      this.dataService.getTileData(
        layerId, feature.geometry['coordinates'], feature.properties['name'], true
      ).subscribe(data => {
          if (!data.properties.n) {
            this.toast.error('Could not find data for location.');
          } else {
            this.dataService.addLocation(data);
          }
          const dataLevel = this.dataService.dataLevels.filter(l => l.id === layerId)[0];
          if (updateMap) {
            if (feature.hasOwnProperty('bbox')) {
              this.dataService.mapView = feature['bbox'];
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
    const dataLevel = this.dataService.dataLevels.filter(l => l.id === layerId)[0];
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
   * If scrolled to the top, enable the zoom.  Unless
   * there is a wheel event currently happening.
   */
  onscroll(e) {
    this.verticalOffset = this.getVerticalOffset();
    if (!this.wheelEvent) {
      this.enableZoom = (this.verticalOffset === 0);
    } else {
      this.enableZoom = false;
    }
  }

  /**
   * Set wheel flag while scrolling with the wheel
   */
  onBeginWheel() { this.wheelEvent = true; }

  private getVerticalOffset() {
    return window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;
  }

  /**
   * Configures options for the `ng2-page-scroll` module
   */
  private configurePageScroll() {
    PageScrollConfig.defaultScrollOffset = 120;
    PageScrollConfig.defaultDuration = 1000;
    // easing function pulled from:
    // https://joshondesign.com/2013/03/01/improvedEasingEquations
    PageScrollConfig.defaultEasingLogic = {
        ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
    };
  }

  /**
   * Sets the function that maps page vertical offset to the
   * amount to translate the "back to map" button
   */
  private setOffsetToTranslate() {
    this.offsetToTranslate = scaleLinear()
      .domain([0, this.panelOffset - 130])
      .range([-this.panelOffset / 2 + 90, 0]);
  }

  /**
   * Gets an array of objects containing the layer type and
   * longitude / latitude coordinates for the locations in the string.
   * @param locations string that represents locations
   */
  private getLocationsFromString(locations: string) {
    return locations.split('+').map(loc => {
      const locArray = loc.split(',');
      if (locArray.length !== 3) { return null; } // invalid location
      return {
        layer: locArray[0],
        lonLat: [ parseFloat(locArray[1]), parseFloat(locArray[2]) ]
      };
    }).filter(loc => loc); // filter null values
  }
}
