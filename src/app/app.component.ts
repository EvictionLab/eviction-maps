import { Component, ViewChild, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import * as bbox from '@turf/bbox';
import * as pointOnSurface from '@turf/point-on-surface';
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
export class AppComponent {
  title = 'Eviction Lab';
  mapBounds;
  autoSwitchLayers = true;
  activeFeatures = [];
  year = 2010;
  verticalOffset;
  enableZoom;
  @ViewChild(MapComponent) map;

  constructor(
    private _sanitizer: DomSanitizer,
    private dialogService: UiDialogService,
    public search: SearchService,
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any
  ) {
    PageScrollConfig.defaultDuration = 1000;
    // easing function pulled from:
    // https://joshondesign.com/2013/03/01/improvedEasingEquations
    PageScrollConfig.defaultEasingLogic = {
        ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
    };
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
    const featureLonLat = pointOnSurface(feature).geometry['coordinates'];
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

  @HostListener('wheel', ['$event'])
  @Debounce(400)
  onwheel(e) {
    if (typeof this.verticalOffset === 'undefined') {
      this.verticalOffset = window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop || 0;
    }
    if (this.verticalOffset === 0) {
      this.map.enableZoom();
    } else {
      this.map.disableZoom();
    }
  }
}
