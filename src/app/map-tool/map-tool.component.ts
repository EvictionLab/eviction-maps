import { Component, OnInit, AfterViewInit, ViewChild, Inject, HostListener, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import Debounce from 'debounce-decorator';
import 'rxjs/add/operator/take';
import {scaleLinear} from 'd3-scale';

import { MapFeature } from './map/map-feature';
import { MapComponent } from './map/map/map.component';
import { UiToastComponent } from '../ui/ui-toast/ui-toast.component';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-map-tool',
  templateUrl: './map-tool.component.html',
  styleUrls: ['./map-tool.component.scss']
})
export class MapToolComponent implements OnInit, AfterViewInit {
  title = 'Eviction Lab';
  // autoSwitchLayers = true;
  enableZoom = true; // controls if map scroll zoom is enabled
  wheelEvent = false; // tracks if there is an active wheel event
  currentRoute = [];
  verticalOffset; // stores the amount the page has scrolled
  panelOffset: number; // tracks the vertical offset to the data panel
  offsetToTranslate; // function that maps vertical offset to the
  activeMenuItem; // tracks the active menu item on mobile
  mapReady: EventEmitter<any>;
  /** gets if the page has scrolled enough to fix the "back to map" button */
  get isDataButtonFixed() {
    if (!this.panelOffset || !this.verticalOffset) { return false; }
    return (this.verticalOffset - this.panelOffset) > 0;
  }
  get isLoading() {
    return this.map.mapLoading || this.dataService.isLoading;
  }
  @ViewChild(MapComponent) map;
  @ViewChild(UiToastComponent) toast;
  @ViewChild('divider') dividerEl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageScrollService: PageScrollService,
    public dataService: DataService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.configurePageScroll();
    this.route.data.take(1).subscribe(this.setMapToolData.bind(this));
    this.route.paramMap.take(1).subscribe(this.setRouteParams.bind(this));
  }

  /**
   * Set the panel offset when the divider element is present
   */
  ngAfterViewInit() {
    this.panelOffset = this.dividerEl.nativeElement.getBoundingClientRect().bottom;
    this.mapReady = this.map.mapReady;
    this.setOffsetToTranslate();
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
  setRouteParams(params: ParamMap) {
    if (params.has('year')) {
      this.dataService.activeYear = params.get('year');
    }
    if (params.has('choropleth')) {
      this.dataService.setChoroplethHighlight(params.get('choropleth'));
    }
    if (params.has('type')) {
      this.dataService.setBubbleHighlight(params.get('type'));
    }
    if (params.has('geography')) {
      const geo = params.get('geography');
      if (geo !== 'auto') {
        this.dataService.setGeographyLevel(geo);
        // this.autoSwitchLayers = false;
      }
    }
    if (params.has('locations')) {
      const locations = this.getLocationsFromString(params.get('locations'));
      this.dataService.setLocations(locations);
    }
    if (params.has('bounds')) {
      const b = params.get('bounds').split(',');
      if (b.length === 4) {
        this.dataService.setMapBounds(b);
      }
    }
  }

  /**
   * Configures the data service with any static data passed through the route
   */
  setMapToolData(data) {
    this.dataService.mapConfig = data.mapConfig;
    if (data.hasOwnProperty('year')) {
      this.dataService.activeYear = data.year;
    }
  }

  /** Update route if it has changed */
  updateRoute() {
    // this.router.navigate(this.dataService.getRouteArray(), { replaceUrl: true });
  }

  updateMapStyle(json) {
    this.map.updateStyle(json);
  }

  getStyleJson() {
    return this.map.getStyle();
  }

  /**
   * Accepts a clicked feature, queries tile data to get data across all years
   * @param feature returned from featureClick event
   */
  onFeatureSelect(feature: MapFeature) {
    const featureLonLat = this.dataService.getFeatureLonLat(feature);
    this.dataService.isLoading = true;
    this.dataService.getTileData(feature['layer']['id'], featureLonLat, null, true)
      .subscribe(data => {
        this.dataService.addLocation(data);
        this.updateRoute();
        this.dataService.isLoading = false;
      });
  }

  /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   * @param updateMap moves the map to the selected location if true
   */
  onSearchSelect(feature: MapFeature | null, updateMap = true) {
    // this.autoSwitchLayers = false;
    if (feature) {
      this.dataService.isLoading = true;
      const layerId = feature.properties['layerId'];
      this.dataService.getTileData(
        layerId, feature.geometry['coordinates'], feature.properties['name'], true
      ).subscribe(data => {
          if (!data.properties.n) {
            this.toast.display('Could not find data for location.');
          } else {
            this.dataService.addLocation(data);
          }
          const dataLevel = this.dataService.dataLevels.filter(l => l.id === layerId)[0];
          this.map.setGroupVisibility(dataLevel);
          if (updateMap) {
            if (feature.hasOwnProperty('bbox')) {
              this.dataService.mapView = feature['bbox'];
            } else {
              this.map.zoomToPointFeature(feature);
            }
          }
          this.dataService.isLoading = false;
        });
    }
  }

  onMenuSelect(itemId: string) {
    this.activeMenuItem = itemId;
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
  @HostListener('window:scroll', ['$event'])
  onscroll(e) {
    this.verticalOffset = this.getVerticalOffset();
    if (!this.wheelEvent) {
      this.enableZoom = (this.verticalOffset === 0);
    } else {
      this.enableZoom = false;
    }
  }

  /**
   * Debounced wheel event on the document, enable zoom
   * if the document is scrolled to the top at the end of
   * the wheel events
   */
  @HostListener('document:wheel', ['$event'])
  @Debounce(250)
  onWheel() {
    if (typeof this.verticalOffset === 'undefined') {
      this.verticalOffset = this.getVerticalOffset();
    }
    this.wheelEvent = false;
    this.enableZoom = (this.verticalOffset === 0);
  }

  /**
   * Set wheel flag while scrolling with the wheel
   */
  @HostListener('wheel', ['$event'])
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
