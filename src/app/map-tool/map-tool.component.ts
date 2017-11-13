import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import Debounce from 'debounce-decorator';
import 'rxjs/add/operator/take';

import { MapFeature } from './map/map-feature';
import { MapComponent } from './map/map/map.component';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-map-tool',
  templateUrl: './map-tool.component.html',
  styleUrls: ['./map-tool.component.scss']
})
export class MapToolComponent implements OnInit {
  title = 'Eviction Lab';
  // autoSwitchLayers = true;
  verticalOffset;
  enableZoom;
  currentRoute = [];
  @ViewChild(MapComponent) map;

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
    this.router.navigate(this.dataService.getRouteArray(), { replaceUrl: true });
  }

  /**
   * Accepts a clicked feature, queries tile data to get data across all years
   * @param feature returned from featureClick event
   */
  onFeatureSelect(feature: MapFeature) {
    const featureLonLat = this.dataService.getFeatureLonLat(feature);
    this.dataService.getTileData(feature['layer']['id'], featureLonLat, null, true)
      .subscribe(data => {
        this.dataService.addLocation(data);
        this.updateRoute();
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
      const layerId = feature.properties['layerId'];
      this.dataService.getTileData(
        layerId, feature.geometry['coordinates'], feature.properties['name'], true
      ).subscribe(data => {
          if (!data.properties.n) {
            console.log('could not find feature');
          }
          const dataLevel = this.dataService.dataLevels.filter(l => l.id === layerId)[0];
          this.map.setGroupVisibility(dataLevel);
          this.dataService.addLocation(data);
          if (updateMap) {
            if (feature.hasOwnProperty('bbox')) {
              this.dataService.mapView = feature['bbox'];
            } else {
              this.map.zoomToPointFeature(feature);
            }
          }
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
   * Set the vertical offset on scroll
   */
  @HostListener('window:scroll', ['$event'])
  onscroll(e) {
    this.verticalOffset = window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;
    if (this.verticalOffset !== 0) {
      this.map.disableZoom();
    }
    if (this.verticalOffset === 0) {
      this.map.enableZoom();
    }
  }

  /**
   * Enables / disables zoom on mouse wheel events
   */
  @HostListener('wheel', ['$event'])
  @Debounce(400)
  onwheel(e) {
    if (typeof this.verticalOffset === 'undefined') {
      this.verticalOffset = window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop || 0;
    }
    this.verticalOffset === 0 ?
      this.map.enableZoom() :
      this.map.disableZoom();
  }

  /**
   * Configures options for the `ng2-page-scroll` module
   */
  private configurePageScroll() {
    PageScrollConfig.defaultDuration = 1000;
    // easing function pulled from:
    // https://joshondesign.com/2013/03/01/improvedEasingEquations
    PageScrollConfig.defaultEasingLogic = {
        ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
    };
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
