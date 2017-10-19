import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import * as bbox from '@turf/bbox';
import * as _isEqual from 'lodash.isequal';

import { MapDataAttribute } from './map/map-data-attribute';
import { MapLayerGroup } from './map/map-layer-group';
import { MapDataObject } from './map/map-data-object';
import { MapFeature } from './map/map-feature';
import { MapService } from './map/map.service';
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
  @ViewChild(MapComponent) map;

  constructor(
    private dialogService: UiDialogService,
    private _sanitizer: DomSanitizer,
    public search: SearchService
  ) { }

  /**
   * Adds a location to the cards and data panel
   * @param feature the feature for the corresponding location to add
   */
  addLocation(feature) {
    const i = this.activeFeatures.findIndex((f) => _isEqual(f, feature));
    if (!(i > -1)) {
      this.activeFeatures = [ ...this.activeFeatures, feature ];
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
          // TODO: Bounds returned are a bit odd, maybe have designated zoom levels
          // by layer and center at that zoom instead?
          this.mapBounds = data.properties['bbox'];
        });
    }
  }
}
