import { Component, ViewChild, Inject, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import * as bbox from '@turf/bbox';
import * as _isEqual from 'lodash.isequal';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import Debounce from 'debounce-decorator';

import { MapFeature } from './map/map-feature';
import { MapComponent } from './map/map/map.component';

import { DataLevels } from './data/data-levels';
import { DataAttributes } from './data/data-attributes';
import { UiDialogService } from './map-ui/ui-dialog/ui-dialog.service';
import { SearchService } from './search/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnChanges {
  title = 'Eviction Lab';
  mapBounds;
  autoSwitchLayers = true;
  activeFeatures = [];
  year = 2010;
  verticalOffset;
  enableZoom = false;
  wheelEvent = false;
  @ViewChild(MapComponent) map;

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

  setYear(year: number) {
    this.year = year;
  }


  /**
   * Adds a location to the cards and data panel
   * @param feature the feature for the corresponding location to add
   */
  addLocation(feature) {
    if (this.activeFeatures.length < 3) {
      const i = this.activeFeatures.findIndex((f) => _isEqual(f, feature));
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
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   */
  onSearchSelect(feature: MapFeature | null) {
    this.autoSwitchLayers = false;
    if (feature) {
      const layerId = this.search.getLayerName(feature.properties['layer']);
      this.search.getTileData(layerId, feature.geometry['coordinates'])
        .subscribe(data => {
          if (data === {}) {
            console.log('could not find feature');
          }
          this.map.setDataLevelFromLayer(layerId);
          if (feature.hasOwnProperty('bbox')) {
            this.mapBounds = feature['bbox'];
          } else {
            this.map.zoomToPointFeature(feature);
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
    // if (!this.wheelEvent) {
    //   this.enableZoom = (this.verticalOffset === 0);
    // } else {
    //   this.enableZoom = false;
    // }
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
    // this.enableZoom = (this.verticalOffset === 0);
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
