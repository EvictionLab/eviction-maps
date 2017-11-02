import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import * as _isEqual from 'lodash.isequal';

import { MapDataAttribute } from '../map-data-attribute';
import { MapLayerGroup } from '../map-layer-group';
import { MapDataObject } from '../map-data-object';
import { MapFeature } from '../map-feature';
import { MapboxComponent } from '../mapbox/mapbox.component';
import { MapService } from '../map.service';
import { DataService } from '../../../data/data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [ MapService ]
})
export class MapComponent implements OnInit {
  @Input()
  get boundingBox() { return this._bounds; }
  set boundingBox(val) {
    if (!_isEqual(val, this._bounds)) {
      this._bounds = val;
      this.map.zoomToBoundingBox(val);
      this.bboxChange.emit(val);
    }
  }

  @Input() autoSwitch = true;
  @Output() featureClick: EventEmitter<any> = new EventEmitter();
  @Output() featureHover: EventEmitter<any> = new EventEmitter();
  @Output() yearChange: EventEmitter<number> = new EventEmitter();
  @Output() evictionTypeChange: EventEmitter<string> = new EventEmitter();
  @Output() bboxChange: EventEmitter<Array<number>> = new EventEmitter();
  zoom = 3;
  censusYear = 2010;
  mapConfig;
  legend;
  mapEventLayers: Array<string> =
    [ 'states', 'cities', 'tracts', 'block-groups', 'zip-codes', 'counties' ];
  mapLoading = false;
  get selectDataLevels(): Array<MapLayerGroup> {
    return (this.dataService.dataLevels.filter((l) => l.minzoom <= this.zoom) || []);
  }
  private _bounds;
  private _mapInstance;

  constructor(
    public dataService: DataService,
    private map: MapService,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.mapConfig = this.dataService.getMapConfig();
  }

  /**
   * Sets the visibility on a layer group
   * @param mapLayer the layer group that was selected
   */
  setGroupVisibility(layerGroup: MapLayerGroup) {
    if (this._mapInstance) {
      console.log('setting group vis', layerGroup, this.dataService.activeDataLevel);
      // Only change data level and turn off auto switch if wasn't already
      // changed by the onMapZoom event handler
      if (this.dataService.activeDataLevel !== layerGroup) {
        this.dataService.setActiveDataLevel(layerGroup);
        this.autoSwitch = false;
      }
      this.dataService.dataLevels.forEach((group: MapLayerGroup) => {
        console.log('setting visisbility', group.id, layerGroup.id);
        this.map.setLayerGroupVisibility(group, (group.id === layerGroup.id));
      });
      // Reset the hover layer
      this.map.setSourceData('hover');
    }

  }

  /**
   * Set data level based on layer ID string input
   * @param layerId layer ID string
   */
  setDataLevelFromLayer(layerId: string) {
    const dataLevel = this.dataService.dataLevels.filter(l => l.id === layerId)[0];
    this.setGroupVisibility(dataLevel);
  }

  tmpSetBubble(newValue) {
    this.dataService.setActiveBubbleAttribute(newValue);
    this.updateMapData();
  }

  tmpSetChoropleth(newValue) {
    this.dataService.setActiveDataHighlight(newValue);
    this.updateMapData();
  }

  updateMapData() {
    if (this._mapInstance) {
      const bubble = this.dataService.getAttributeWithYear('bubble') as MapDataAttribute;
      const choropleth = this.dataService.getAttributeWithYear('choropleth') as MapDataAttribute;
      this.mapEventLayers.forEach((layerId) => {
        // update choropleth
        if (choropleth) {
          const newFill = {
            'property': choropleth.id,
            'default': choropleth.default,
            'stops': (choropleth.fillStops[layerId] ?
              choropleth.fillStops[layerId] : choropleth.fillStops['default'])
          };
          this.map.setLayerStyle(layerId, 'fill-color', newFill);
          this.map.setLayerFilterProperty(`${layerId}_null`, choropleth.id);
          this.updateLegend();
        }
        // update bubbles
        if (bubble) {
          ['circle-radius', 'circle-color', 'circle-stroke-color'].forEach(prop => {
            this.map.setLayerDataProperty(`${layerId}_bubbles`, prop, bubble.id);
          });
        }
      });
    }
  }

  /**
   * Sets the zoom level across both the map and zoom control components
   * @param zoomLevel new zoom level
   */
  setMapZoomLevel(zoomLevel: number) {
    this.zoom = +zoomLevel;
    this.map.setZoomLevel(zoomLevel);
  }

  /**
   * Zoom to Point feature
   * @param feature Point feature
   */
  zoomToPointFeature(feature: MapFeature) {
    this.map.zoomToPoint(feature);
  }

  /**
   * Sets the data year for the map, updates data highlights and layers
   * @param year
   */
  setDataYear(year: number) {
    this.dataService.setActiveYear(year);
    this.yearChange.emit(year);
    this.onYearChange(year);
  }

  onYearChange(year: number) {
    // Get census year, check if changed, update sources only if it did
    const censusYear = this.yearToCensusYear(year);
    if (this.censusYear !== censusYear) {
      this.censusYear = censusYear;
      this.map.updateCensusSource(this.dataService.dataLevels, ('' + this.censusYear).slice(2));
    }
    this.updateMapData();
  }

  /**
   * Returns sanitized gradient for the legend
   */
  getLegendGradient() {
    return this._sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(to right, ${this.legend[1][1]}, ${this.legend[this.legend.length - 1][1]})`
    );
  }

  /**
   * Update the legend to correspond to the fill stops on the active data highlight
   */
  updateLegend() {
    const dataLevel = this.dataService.activeDataLevel;
    const dataHighlight = this.dataService.activeDataHighlight;
    console.log('update legend', dataHighlight);
    if (!dataLevel || !dataHighlight) {
      this.legend = null;
      return;
    }
    this.legend =
      dataHighlight.fillStops[dataLevel.id] ||
      dataHighlight.fillStops['default'];
  }

  /**
   * Set the map instance, the data level, highlight layer, current year, and zoom
   * handler when the map is ready
   * @param map mapbox instance
   */
  onMapReady(map) {
    this._mapInstance = map;
    this.map.setMapInstance(map);
    this.map.setupHoverPopup(this.mapEventLayers);
    this.updateMapData();
    // this.setDataYear(this.dataYear);
    this.onMapZoom(this.mapConfig.zoom);
    this.autoSwitch = true;
    this.map.isLoading$.distinctUntilChanged()
      .debounceTime(200)
      .subscribe((state) => { this.mapLoading = state; });
  }

  /**
   * Set the zoom value for the app, auto adjust layers if enabled
   * @param zoom the current zoom level of the map
   */
  onMapZoom(zoom) {
    this.zoom = zoom;
    if (this.dataService.activeDataLevel && this.dataService.activeDataLevel.minzoom > zoom) {
      this.autoSwitch = true;
    }
    if (this.autoSwitch) {
      const visibleGroups = this.map.filterLayerGroupsByZoom(this.dataService.dataLevels, zoom);
      if (visibleGroups.length > 0) {
        if (this.dataService.activeDataLevel !== visibleGroups[0]) {
          this.dataService.setActiveDataLevel(visibleGroups[0]);
          this.updateMapData();
        }
      }
    }
  }

  enableZoom() { return this.map.enableZoom(); }
  disableZoom() { return this.map.disableZoom(); }

  /**
   * Emits the new bounds of the current map view anytime the map finishes moving
   * @param e the moveend event
   */
  onMapMoveEnd(e) {
    this._bounds = this.map.getBoundsArray();
    this.bboxChange.emit(this.boundingBox);
  }

  /**
   * Updates mapFeatures on map render
   * @param event
   */
  onMapRender(event) {}

  /**
   * Activates a feature if it is currently in a "hovered" state
   * If the feature is not yet in a "hovered" state, set the feature
   * as hovered.
   * @param feature the map feature
   */
  onFeatureClick(feature) {
    if (feature && feature.properties) {
      console.log(feature);
      this.featureClick.emit(feature);
    }
  }

  /**
   * Sets the tooltip and highlighted shape on the map
   * @param feature the feature being hovered (or null if no longer hovering)
   */
  onFeatureHover(feature) {
    this.featureHover.emit(feature);
    if (feature && feature.layer.id === this.dataService.activeDataLevel.id) {
      const union = this.map.getUnionFeature(this.dataService.activeDataLevel.id, feature);
      this.map.setSourceData('hover', union);
    } else {
      this.map.setSourceData('hover');
    }
  }



  /**
   * Convert any year to the nearest decennial census year
   * @param year
   */
  private yearToCensusYear(year: number) {
    return Math.floor(year / 10) * 10;
  }
}
