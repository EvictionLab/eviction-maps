import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Inject,
  HostListener,
  ElementRef
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/take";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/first";
import "rxjs/add/operator/skip";
import "rxjs/add/operator/throttleTime";
import "rxjs/add/observable/combineLatest";
import { scaleLinear } from "d3-scale";
import {
  TranslateService,
  TranslatePipe,
  TranslateDirective
} from "@ngx-translate/core";
import { ToastsManager, ToastOptions } from "ng2-toastr";
import * as _debounce from "lodash.debounce";
import { SELECTION_GUIDE, LOCATION_GUIDE, DATA_GUIDE } from "./data/guides";

import { LoadingService } from "../services/loading.service";
import { MapFeature } from "./map/map-feature";
import { MapComponent } from "./map/map/map.component";
import { MapToolService } from "./map-tool.service";
import { PlatformService } from "../services/platform.service";
import { UiDialogService } from "../ui/ui-dialog/ui-dialog.service";
import { RoutingService } from "../services/routing.service";
import { environment } from "../../environments/environment";
import { AnalyticsService } from "../services/analytics.service";
import { ScrollService } from "../services/scroll.service";
import { DataService } from "../services/data.service";
import { Guide } from "./guide/guide";
import { GuideService } from "./guide/guide.service";

@Component({
  selector: "app-map-tool",
  templateUrl: "./map-tool.component.html",
  styleUrls: ["./map-tool.component.scss"],
  providers: [TranslatePipe]
})
export class MapToolComponent implements OnInit, OnDestroy, AfterViewInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild(MapComponent) map;
  @ViewChild("divider") dividerEl: ElementRef;
  id = "map-tool";
  enableZoom = true; // controls if map scroll zoom is enabled
  wheelEvent = false; // tracks if there is an active wheel event
  currentRoute = [];
  verticalOffset; // stores the amount the page has scrolled
  panelOffset: number; // tracks the vertical offset to the data panel
  offsetToTranslate; // function that maps vertical offset to the
  activeMenuItem; // tracks the active menu item on mobile
  helpData: string; // translated title / content for help dialog.
  mapSupported = mapboxgl.supported();
  updateRoute = _debounce(() => {
    this.routing.updateRouteData(this.mapToolService.getCurrentData());
  }, 400);
  currentGuide: Guide = SELECTION_GUIDE;
  private defaultMapConfig = {
    style: `${environment.deployUrl}assets/style.json`,
    center: [-98.5795, 39.8283],
    zoom: 3,
    minZoom: 2,
    maxZoom: 15,
    maxBounds: [
      [-190.671875, -12.897489183755892],
      [-44.6484375, 79.56054626376367]
    ]
  };

  constructor(
    public loader: LoadingService,
    public mapToolService: MapToolService,
    public guide: GuideService,
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
    private dataService: DataService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.initMapToolData();
    this.routing.setActivatedRoute(route);
    // Add click to dimiss to all toast messages
    this.toast.onClickToast().subscribe(t => this.toast.dismissToast(t));
  }

  ngOnInit() {
    this.setupPageScroll();
    // Set data from the route on init
    this.routing
      .getMapRouteData()
      .take(1)
      .subscribe(data => this.mapToolService.setCurrentData(data));
    // Subscribe to language changes and store translated help content
    this.translate.onLangChange.takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.updateRoute();
    });
    // Check device support for map once language has loaded
    this.translate
      .getTranslation(this.translate.currentLang)
      .take(1)
      .subscribe(() => {
        this.checkSupport();
      });
    // set map height on dimension changes
    this.platform.dimensions$
      .distinctUntilChanged((prev, next) => prev.width === next.width)
      .skip(1)
      .subscribe(this.setMapSize.bind(this));
    this.mapToolService.bindFeatureChange(f =>
      setTimeout(this.updateFeatureGuide.bind(this), 2000)
    );
    this.guide.completed.subscribe(guideId => {
      this.checkGuidesComplete(guideId);
    });
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
    setTimeout(() => {
      this.setMapSize();
    }, 1000);
  }

  /**
   * Update the position of the data panel on window resize
   * @param e resize event
   */
  @HostListener("window:resize", ["$event"])
  onResize(e) {
    this.panelOffset =
      this.verticalOffset +
      this.dividerEl.nativeElement.getBoundingClientRect().bottom;
  }

  /** Checks if the map features are supported (currently just WebGL) and shows a dialog if not */
  checkSupport() {
    if (!this.mapSupported) {
      const title = this.translatePipe.transform("MAP.UNSUPPORTED_TITLE");
      const data = this.translatePipe.transform("MAP.UNSUPPORTED_MESSAGE");
      return this.dialogService.showDialog({
        title: title,
        content: [{ type: "html", data: data }],
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
    // if (this.mapToolService.embed) { return; }
    const featureLonLat = this.mapToolService.getFeatureLonLat(feature);
    this.loader.start("feature");
    const maxLocations = this.mapToolService.addLocation(feature);
    // exit early if at the maximum number of locations
    if (maxLocations) {
      this.loader.end("feature");
      this.showMaxLocationsError();
      return;
    }
    // track event
    const selectEvent = {
      locationSelected: this.mapToolService.getFullLocationName(feature),
      locatonSelectedLevel: feature.properties.layerId,
      locationFindingMethod: "map",
      combinedSelections: this.mapToolService.getCurrentDataString()
    };
    this.analytics.trackEvent("locationSelection", selectEvent);
    // pull full data for the location
    this.dataService
      .getTileData(feature.properties["GEOID"] as string, featureLonLat, true)
      .subscribe(
        data => {
          this.mapToolService.updateLocation(data);
          this.updateRoute();
          this.loader.end("feature");
        },
        err => {
          this.loader.end("feature");
          console.error(err.message);
        }
      );
  }

  onYearChange(year: number) {
    this.mapToolService.setActiveYear(year);
    this.updateRoute();
  }

  onBubbleChange(bubble: any) {
    // if bubble has no name, tool hasn't initialized yet
    if (bubble.name) {
      this.mapToolService.setBubbleHighlight(bubble.id);
      this.analytics.trackEvent("evictionDataSelection", {
        evictionDataType: bubble.langKey,
        combinedSelections: this.mapToolService.getCurrentDataString()
      });
      this.updateRoute();
    }
  }

  onChoroplethChange(choropleth: any) {
    // if choropleth has no name, tool hasn't initialized yet
    if (choropleth.name) {
      this.mapToolService.setChoroplethHighlight(choropleth.id);
      this.analytics.trackEvent("censusDataSelection", {
        evictionDataType: choropleth.langKey,
        combinedSelections: this.mapToolService.getCurrentDataString()
      });
      this.updateRoute();
    }
  }

  onGeographyChange(geography: any) {
    // if geography has no name, tool hasn't initialized yet
    if (geography.name) {
      this.mapToolService.setGeographyLevel(geography.id);
      this.updateRoute();
    }
  }

  /**
   * Progress the guide as select menus close
   * @param selectId
   */
  updateSelectionGuide(selectId: string) {
    // make sure conditions are met before showing guide
    if (this.guide.isGuideOff() || this.guide.isVisibleStep()) return;
    switch (selectId) {
      case "bubble":
        if (
          this.guide.currentGuideId === "selections" &&
          this.guide.stepNum === 0 &&
          !this.guide.isStepNumberViewed(1)
        )
          this.guide.resume(1);
        break;
      case "choro":
        if (
          this.guide.currentGuideId === "selections" &&
          this.guide.stepNum === 1 &&
          !this.guide.isStepNumberViewed(2)
        )
          this.guide.resume(2);
        break;
      case "layer":
        if (
          this.guide.currentGuideId === "selections" &&
          this.guide.stepNum === 2
        )
          this.guide.end();
        break;
    }
  }

  updateLocationGuide(e) {
    // make sure conditions are met before showing guide
    if (
      this.guide.isGuideOff() ||
      this.guide.isVisibleStep() ||
      !this.guide.hasGuideStarted("selections") ||
      this.guide.isGuideComplete("location") ||
      this.guide.isGuideComplete("data")
    )
      return;
    // skip location selection guide if location
    // is already selected
    if (
      this.mapToolService.activeFeatures.length > 0 &&
      this.guide.isGuideComplete("selections")
    ) {
      this.guide.setCompleted("location");
      this.updateFeatureGuide();
      return;
    }
    // start the location selection guide
    if (!this.guide.isGuideLoaded("location")) {
      this.guide.load(LOCATION_GUIDE);
    }
    this.guide.start();
  }

  updateFeatureGuide() {
    // if locations are loaded, but the selection guide
    // has not been shown, then redirect to that guide
    if (!this.guide.hasGuideStarted("selections")) {
      this.startSelectionGuide();
      return;
    }
    // make sure conditions are met before showing guide
    if (
      this.guide.isGuideOff() ||
      this.guide.isVisibleStep() ||
      this.guide.isGuideComplete("data") ||
      this.mapToolService.activeFeatures.length === 0
    )
      return;
    // start the "view more data" guide
    if (!this.guide.isGuideLoaded("data")) {
      this.guide.load(DATA_GUIDE);
    }
    this.guide.start();
  }

  startSelectionGuide() {
    // make sure conditions are met before showing guide
    if (
      this.guide.isGuideOff() ||
      this.guide.isVisibleStep() ||
      this.guide.isGuideComplete("selections")
    )
      return;
    this.guide.load(SELECTION_GUIDE);
    this.guide.start();
  }

  checkGuidesComplete(guideId: Array<string>) {
    // turn off the guide if they're all done
    if (
      this.guide.isGuideComplete("selections") &&
      this.guide.isGuideComplete("location") &&
      this.guide.isGuideComplete("data")
    ) {
      this.guide.disable();
    }
  }

  trackLevelSelection(geography: any) {
    this.analytics.trackEvent("mapLevelSelection", {
      mapLevel: geography.langKey,
      combinedSelections: this.mapToolService.getCurrentDataString()
    });
  }

  /**
   * Returns feature with center point based on bbox if it has been flagged as an override.
   * Place names should be added to `overrides` if the center point returned by the geocoder
   * does not correspond to the correct location in the Eviction Lab tilesets.
   */
  checkCenterOverrides(feature) {
    const overrides = ["Milwaukee, Wisconsin, United States"];
    if (
      feature.hasOwnProperty("place_name") &&
      overrides.indexOf(feature["place_name"]) > -1
    ) {
      feature["center"] = [
        (feature["bbox"][0] + feature["bbox"][2]) / 2,
        (feature["bbox"][1] + feature["bbox"][3]) / 2
      ];
    }
    return feature;
  }

  /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   * @param updateMap moves the map to the selected location if true
   */
  onSearchSelect(searchData: any, updateMap = true) {
    const feature: MapFeature = this.checkCenterOverrides(searchData.feature);
    const maxLocations = this.mapToolService.activeFeatures.length >= 3;

    if (feature) {
      if (maxLocations) {
        this.showMaxLocationsError();
        this.mapZoomToFeature(feature);
        return;
      }

      this.loader.start("search");
      const layerId = feature.properties["layerId"] as string;
      this.dataService.getSearchTileData(feature).subscribe(
        data => {
          if (!data.properties.n) {
            this.toast.error(this.translatePipe.transform("MAP.NO_DATA_ERROR"));
            this.mapZoomToFeature(feature);
          } else {
            this.mapToolService.addLocation(data);
          }
          const dataLevel = this.mapToolService.dataLevels.filter(
            l => l.id === layerId
          )[0];
          if (updateMap && this.map) {
            this.mapZoomToFeature(data);
            // Wait for map to be done zooming, then set data layer
            this.map.mapService.zoom$
              .distinctUntilChanged()
              .filter(zoom => zoom !== null)
              .first()
              .subscribe(() => this.map.setGroupVisibility(dataLevel));
          }
          this.loader.end("search");
        },
        err => {
          this.toast.error(this.translatePipe.transform("MAP.NO_DATA_ERROR"));
          this.mapZoomToFeature(feature);
          this.loader.end("search");
        }
      );
    }
  }

  /**
   * Show toast message on initial search input if max locations already selected
   */
  onInitialSearchInput() {
    if (this.mapToolService.activeFeatures.length >= 3) {
      this.showMaxLocationsError();
    }
  }

  /**
   * Set map layer and view from clicked location card header
   * @param feature clicked feature from card
   */
  onCardHeaderClick(feature: MapFeature) {
    if (!this.map) {
      return;
    }
    const layerId = feature.properties["layerId"];
    const dataLevel = this.mapToolService.dataLevels.filter(
      l => l.id === layerId
    )[0];
    this.map.setGroupVisibility(dataLevel);
    this.map.mapService.zoomToFeature(feature);
  }

  /**
   * Triggers a scroll to the top of the page
   */
  goToTop() {
    if (this.scroll.getVerticalOffset() > 0) {
      const topEl = this.document.getElementById("top");
      this.scroll.scrollTo("#top", { pageScrollOffset: topEl.offsetTop });
      // set focus to map UI, but give it some time to scroll
      setTimeout(() => {
        topEl.querySelector("button").focus();
      }, 1000);
    }
  }

  /**
   * Triggers a scroll to the data panel
   */
  goToDataPanel(e) {
    // track event
    this.analytics.trackEvent("viewMoreData");
    // animate scroll to data panel
    this.scroll.scrollTo("#data-panel");
  }

  startGuidedMode() {
    this.guide.reset();
    this.startSelectionGuide();
  }

  private mapZoomToFeature(feature: any) {
    if (!this.map) {
      return;
    }
    this.map.mapService.zoomToFeature(feature);
  }

  /** Show the toast for maximum locations, and expand the cards as a visual cue */
  private showMaxLocationsError() {
    this.toast.error(this.translatePipe.transform("MAP.MAX_LOCATIONS_ERROR"));
    this.mapToolService.cardsCollapsed = false;
  }

  /**
   * Configures the data service with any static data passed through the route
   */
  private initMapToolData() {
    // Set default zoom to 2 on mobile
    if (this.platform.isMobile && this.defaultMapConfig) {
      this.defaultMapConfig.zoom = 2;
    }
    if (environment.useMapbox) {
      this.defaultMapConfig.style = `${environment.deployUrl}assets/style-mapbox.json`;
    }
    this.mapToolService.mapConfig = this.defaultMapConfig;
    if (environment.hasOwnProperty("maxYear")) {
      this.mapToolService.setActiveYear(environment.maxYear);
    }
  }

  /**
   * Configures options for the `ngx-page-scroll` module, and setup scroll observables
   * to enable / disable map zoom
   */
  private setupPageScroll() {
    // Setup scroll events to handle enable / disable map zoom
    Observable.fromEvent(this.document, "wheel")
      .debounceTime(250)
      .subscribe(e => this.onWheel());
    Observable.fromEvent(this.document, "wheel")
      .throttleTime(50)
      // only fire when wheel event hasn't been triggered yet
      .filter(() => !this.wheelEvent)
      .subscribe(e => {
        // only set wheel scroll flag when we're scrolling from a non-top position
        if (this.verticalOffset > 0) {
          this.wheelEvent = true;
        }
      });
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
    this.enableZoom = this.verticalOffset <= 0;
  }

  /**
   * If scrolled to the top, enable the zoom.  Unless
   * there is a wheel event currently happening.
   */
  private onScroll(yOffset: number) {
    this.verticalOffset = yOffset;
    if (!this.wheelEvent) {
      this.enableZoom = this.verticalOffset <= 0;
    } else {
      this.enableZoom = false;
    }
  }

  /** Set the map component height, if the map is available */
  private setMapSize() {
    if (!this.map) {
      return;
    }
    const newHeight =
      this.platform.nativeWindow.innerHeight -
      this.map.el.nativeElement.offsetTop;
    this.map.el.nativeElement.style.height = newHeight + "px";
  }
}
