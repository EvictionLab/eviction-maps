import { Component, ViewChild, Inject, HostListener, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import * as bbox from '@turf/bbox';
import * as polylabel from 'polylabel';
import * as _isEqual from 'lodash.isequal';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import Debounce from 'debounce-decorator';

import { MapFeature } from './map/map-feature';
import { MapComponent } from './map/map/map.component';

import { DataPanelComponent } from './data-panel/data-panel.component';
import { DataLevels } from './data/data-levels';
import { DataAttributes } from './data/data-attributes';
import { UiDialogService } from './map-ui/ui-dialog/ui-dialog.service';
import { SearchService } from './search/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnChanges, AfterViewInit {
  title = 'Eviction Lab';
  mapBounds;
  autoSwitchLayers = true;
  activeFeatures = [];
  year = 2010;
  verticalOffset = 0;
  enableZoom = true;
  wheelEvent = false;
  panelOffset: number;
  @ViewChild(MapComponent) map;
  @ViewChild('divider') dividerEl;
  get buttonOffset() {
    if (!this.panelOffset || !this.verticalOffset) { return 'translateY(0)'; }
    return 'translateY(' + Math.max(0, 56 + this.verticalOffset - this.panelOffset) + 'px)';
  }

  constructor(
    private _sanitizer: DomSanitizer,
    private dialogService: UiDialogService,
    public search: SearchService,
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any
  ) {
    PageScrollConfig.defaultDuration = 1000;
    PageScrollConfig.defaultScrollOffset = 56;
    // easing function pulled from:
    // https://joshondesign.com/2013/03/01/improvedEasingEquations
    PageScrollConfig.defaultEasingLogic = {
        ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.enableZoom) {
      console.log('toggle zoom event', changes.enableZoom, this.enableZoom);
    }
  }

  ngAfterViewInit() {
    // console.log(this.dividerEl);
    this.panelOffset = this.dividerEl.nativeElement.getBoundingClientRect().bottom;
  }

  @HostListener('window:resize', [ '$event' ])
  onresize(e) {
    this.panelOffset =
      this.verticalOffset + this.dividerEl.nativeElement.getBoundingClientRect().bottom;
  }

  setYear(year: number) {
    this.year = year;
  }


  /**
   * Adds a location to the cards and data panel
   * @param feature the feature for the corresponding location to add
   */
  addLocation(feature) {
    if (this.activeFeatures.length < 3) {
      const i = this.activeFeatures.findIndex((f) => {
        return f.properties.n === feature.properties.n &&
          f.properties.pl === feature.properties.pl;
      });
      if (!(i > -1)) {
        this.activeFeatures = [ ...this.activeFeatures, feature ];
      }
    }
  }

  /**
   * Removes a location from the cards and data panel
   */
  removeLocation(feature) {
    const featuresCopy = this.activeFeatures.slice();
    const i = featuresCopy.findIndex((f) => _isEqual(f, feature));
    if (i > -1) {
      featuresCopy.splice(i, 1);
      this.activeFeatures = featuresCopy;
    }
  }

  /**
   * Accepts a clicked feature, queries tile data to get data across all years
   * @param feature returned from featureClick event
   */
  onFeatureSelect(feature: MapFeature) {
    const coords = feature.geometry['type'] === 'MultiPolygon' ?
      feature.geometry['coordinates'][0] : feature.geometry['coordinates'];
    const featureLonLat = polylabel(coords, 1.0);
    this.search.getTileData(feature['layer']['id'], featureLonLat, true)
      .subscribe(data => this.addLocation(data));
  }

  /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   * @param updateMap moves the map to the selected location if true
   */
  onSearchSelect(feature: MapFeature | null, updateMap = true) {
    this.autoSwitchLayers = false;
    if (feature) {
      const layerId = this.search.getLayerName(feature.properties['layer']);
      this.search.getTileData(layerId, feature.geometry['coordinates'], true)
        .subscribe(data => {
          if (data === {}) {
            console.log('could not find feature');
          }
          this.map.setDataLevelFromLayer(layerId);
          this.addLocation(data);
          if (updateMap) {
            if (feature.hasOwnProperty('bbox')) {
              this.mapBounds = feature['bbox'];
            } else {
              this.map.zoomToPointFeature(feature);
            }
          }
        });
    }
  }

  goToTop() {
    const pageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#top');
    this.pageScrollService.start(pageScrollInstance);
  }

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
}
