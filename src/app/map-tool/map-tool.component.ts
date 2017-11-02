import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as bbox from '@turf/bbox';
import * as polylabel from 'polylabel';
import * as _isEqual from 'lodash.isequal';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import Debounce from 'debounce-decorator';
import 'rxjs/add/operator/switchMap';

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
  autoSwitchLayers = true;
  verticalOffset;
  enableZoom;
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
    console.log('init');
    this.route.paramMap.subscribe(this.setRouteParams.bind(this));
  }

  setRouteParams(params: ParamMap) {
    // this.setYear(parseFloat(params.get('year')));
  }

  configurePageScroll() {
    PageScrollConfig.defaultDuration = 1000;
    // easing function pulled from:
    // https://joshondesign.com/2013/03/01/improvedEasingEquations
    PageScrollConfig.defaultEasingLogic = {
        ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
    };
  }

  /**
   * Accepts a clicked feature, queries tile data to get data across all years
   * @param feature returned from featureClick event
   */
  onFeatureSelect(feature: MapFeature) {
    const coords = feature.geometry['type'] === 'MultiPolygon' ?
      feature.geometry['coordinates'][0] : feature.geometry['coordinates'];
    const featureLonLat = polylabel(coords, 1.0);
    this.dataService.getTileData(feature['layer']['id'], featureLonLat, true)
      .subscribe(data => this.dataService.addLocation(data));
  }

  /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   * @param updateMap moves the map to the selected location if true
   */
  onSearchSelect(feature: MapFeature | null, updateMap = true) {
    this.autoSwitchLayers = false;
    if (feature) {
      const layerId = feature.properties['layerId'];
      this.dataService.getTileData(layerId, feature.geometry['coordinates'], true)
        .subscribe(data => {
          if (data === {}) {
            console.log('could not find feature');
          }
          this.map.setDataLevelFromLayer(layerId);
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
}
