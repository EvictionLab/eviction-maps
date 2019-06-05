import {
  Component, OnInit, OnChanges, HostBinding, Input, Output, EventEmitter, SimpleChanges, ViewChild,
  HostListener, ElementRef
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import 'rxjs/add/operator/distinctUntilChanged';
import * as _isEqual from 'lodash.isequal';
import * as _debounce from 'lodash.debounce';

import { MapDataAttribute } from '../../data/map-data-attribute';
import { MapLayerGroup } from '../../data/map-layer-group';
import { MapDataObject } from '../../data/map-data-object';
import { MapFeature } from '../map-feature';
import { MapService } from '../map.service';
import { LoadingService } from '../../../services/loading.service';
import { PlatformService } from '../../../services/platform.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { MapToolService } from '../../map-tool.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [ TranslatePipe ]
})
export class MapComponent implements OnInit, OnChanges {
  censusYear = 2010;
  minYear = environment.minYear;
  maxYear = environment.maxYear;
  mapEventLayers: Array<string>;
  cardProps;
  zoom = 3;
  private autoSelect = { id: 'auto', name: 'Auto', langKey: 'LAYERS.AUTO', minzoom: 0 };
  private _store = {
    layer: null,
    bubble: null,
    choropleth: null,
    year: null,
    bounds: null,
    autoSwitch: true,
    loading: false,
    attributes: []
  };
  private _mapInstance;
  // switch to restore auto switching layers once a map move has ended.
  private restoreAutoSwitch = false;

  /** Sets and gets the bounds for the map */
  @Input()
  set boundingBox(val) {
    if (!val) { return; }
    const roundedVal = val.map(v => Math.round(v * 1000) / 1000); // round bounds to 3 decimals
    if (!_isEqual(roundedVal, this._store.bounds) && val.length === 4) {
      this._store.bounds = roundedVal;
      if (this._mapInstance) {
        this.mapService.zoomToBoundingBox(this._store.bounds);
      }
      this.boundingBoxChange.emit(this._store.bounds);
    }
  }
  get boundingBox() { return this._store.bounds; }
  @Output() boundingBoxChange: EventEmitter<Array<number>> = new EventEmitter();

  /** Sets and gets the bubble attribute to display on the map */
  @Input()
  set selectedBubble(newBubble: MapDataAttribute) {
    if (!_isEqual(newBubble, this._store.bubble)) {
      this._store.bubble = newBubble;
      this.selectedBubbleChange.emit(newBubble);
      this.updateMapBubbles();
      this.updateCardProperties();
    }
  }
  get selectedBubble(): MapDataAttribute { return this._store.bubble; }
  @Output() selectedBubbleChange: EventEmitter<MapDataAttribute> = new EventEmitter();

  /** Sets and gets the choropleth attribute to display on the map */
  @Input()
  set selectedChoropleth(newChoropleth: MapDataAttribute) {
    if (!_isEqual(newChoropleth, this._store.choropleth)) {
      this._store.choropleth = newChoropleth;
      this.selectedChoroplethChange.emit(newChoropleth);
      this.updateMapChoropleths();
      this.updateCardProperties();
    }
  }
  get selectedChoropleth(): MapDataAttribute { return this._store.choropleth; }
  @Output() selectedChoroplethChange: EventEmitter<MapDataAttribute> = new EventEmitter();

  /** Sets and gets the layer to display on the map */
  @Input()
  set selectedLayer(newLayer: MapLayerGroup) {
    // if "auto" option is selected, turn on auto switch and return
    if (newLayer.id === 'auto') {
      this.autoSwitch = true;
      return;
    }
    if (this._store.layer) {
      if (this._store.layer.id !== newLayer.id) {
        // update the layer if it has changed
        this._store.layer = newLayer;
        this.updateSelectedLayerName();
        this.selectedLayerChange.emit(this._store.layer);
        this.updateMapData();
      }
    } else {
      // if there is no value yet, set it, and turn off auto-switch
      // if layer zoom range is outside the current zoom
      this._store.layer = newLayer;
      this.autoSwitch = newLayer.zoom[0] <= this.zoom && newLayer.zoom[1] >= this.zoom;
    }
  }
  get selectedLayer(): MapLayerGroup { return this._store.layer; }
  @Output() selectedLayerChange: EventEmitter<MapLayerGroup> = new EventEmitter();


  /** Sets and gets the year to display data on the map */
  @Input()
  set year(newYear: number) {
    if (newYear !== this._store.year) {
      this._store.year = newYear;
      if (newYear) { this.updateMapYear(); }
    }
  }
  get year() { return this._store.year; }
  @Output() yearChange: EventEmitter<number> = new EventEmitter();

  /** Data attributes for bubbles, choropleths, and cards */
  @Input() set dataAttributes(value) {
    console.log('set map dataAttributes', value)
    this._store.attributes = value;
    this.bubbleOptions = this.dataAttributes.filter(d => d.type === 'bubble');
    this.choroplethOptions = this.dataAttributes.filter(d => d.type === 'choropleth');
  }
  get dataAttributes() { return this._store.attributes; }


  /** Mapboxgl map configuration */
  @Input() mapConfig;
  /** Available layers to toggle between */
  @Input() layerOptions: MapLayerGroup[] = [];
  /** Handles if zoom is enabled on the map */
  @Input() scrollZoom: boolean;
  /** Tracks the currently selected menu item for mobile menu */
  @Input() activeMenuItem: string;
  @Input() activeFeatures: MapFeature[] = [];
  @Output() clickedCardHeader: EventEmitter<any> = new EventEmitter();
  @Output() dismissedCard: EventEmitter<any> = new EventEmitter();
  @Output() featureClick: EventEmitter<any> = new EventEmitter();
  @Output() showDataClick = new EventEmitter();
  @Output() showMapClick = new EventEmitter();
  // emits event when layer changed from dropdown (for analytics)
  @Output() layerChangedFromDropdown = new EventEmitter();
  // emits when help button is clicked
  @Output() helpClick = new EventEmitter();
  @HostBinding('class.cards-active') get cardsActive() {
    return this.activeFeatures.length;
  }
  @HostBinding('class.slider-active') get sliderActive() {
    return (this.selectedBubble && !this.selectedBubble.id.includes('none')) ||
      (this.selectedChoropleth && !this.selectedChoropleth.id.includes('none')) ||
      this.cardsActive;
  }
   /** Gets if the legend should be shown or not */
  @HostBinding('class.legend-active') get showLegend(): boolean {
    return this.selectedLayer &&
      (
        (this.selectedChoropleth && !this.selectedChoropleth.id.includes('none')) ||
        (this.selectedBubble && !this.selectedBubble.id.includes('none'))
      );

  }
  @ViewChild('pop') mapTooltip;
  @ViewChild('mapEl') mapEl: ElementRef;
  /** Tracks if the "start here" tooltip is enabled */
  tooltipEnabled = true;
  /** Tracks if the current resolution is greater than mobile */
  gtMobile = false;
  /** Tracks if the current resolution is greater than tablet */
  gtTablet = false;
  /** Options available for bubbles */
  bubbleOptions: MapDataAttribute[] = [];
  /** Options available for choropleths */
  choroplethOptions: MapDataAttribute[] = [];

  /** Toggle for auto switch between layerOptions based on min / max zooms */
  set autoSwitch(on: boolean) {
    this._store.autoSwitch = on;
    this.updateSelectedLayerName();
  }
  get autoSwitch(): boolean { return this._store.autoSwitch; }

  /** Gets the layers available at the current zoom */
  get selectDataLevels(): Array<MapLayerGroup> {
    const selectOptions = (this.layerOptions.filter((l) => l.minzoom <= this.zoom) || []);
    return [ this.autoSelect, ...selectOptions ];
  }
  /** Debounced function for year change */
  private updateMapYear = _debounce(() => {
      this.yearChange.emit(this.year);
      if (this._mapInstance) {
        this.updateCensusYear();
        // Don't update highlight features on year change
        this.updateMapBubbles();
        this.updateMapChoropleths();
      }
    }, 400
  );

  // returns true if there is data being shown that changes by year
  get isYearDataShown() {
    if (!this.activeFeatures || !this.selectedBubble || !this.selectedChoropleth) { return false; }
    return this.activeFeatures.length > 0 ||
      this.selectedBubble.id.indexOf('none') < 0 ||
      this.selectedChoropleth.id.indexOf('none') < 0;
  }

  private blockMapClick = false;
  private _debug = true;

  constructor(
    public el: ElementRef,
    public mapToolService: MapToolService,
    private mapService: MapService,
    private loader: LoadingService,
    private platform: PlatformService,
    private translate: TranslateService,
    private translatePipe: TranslatePipe,
    private analytics: AnalyticsService
  ) {
    translate.onLangChange.subscribe(l => this.updateSelectedLayerName());
    this.mapService.zoom$.skip(1)
      .filter(zoom => zoom !== null)
      .subscribe((zoom) => this.onMapZoomEnd(zoom));
  }

  ngOnInit() {
    this.gtMobile = this.platform.isLargerThanMobile;
    this.gtTablet = this.platform.isLargerThanTablet;
    this.mapEventLayers = this.layerOptions.map((layer) => layer.id);
    this.updateCardProperties();
    // Show tooltip 1 second after init
    setTimeout(() => { this.mapTooltip.show(); }, 1000);
    // Update the animation on an interval
    // NOTE: Parallax is disabled on the map for performance, uncomment to re-enable.
    // setInterval(this.parallaxMap.bind(this), 10);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.scrollZoom) {
      changes.scrollZoom.currentValue ? this.enableZoom() : this.disableZoom();
    }
    if (changes.activeFeatures && this.mapService.mapCreated) {
      this.updateHighlights();
    }
  }

  /** Update if the resolution is larger than tablet on resize */
  @HostListener('window:resize', ['$event']) onWindowResize() {
    this.gtMobile = this.platform.isLargerThanMobile;
    this.gtTablet = this.platform.isLargerThanTablet;
  }

  /** Hide "start here" tooltip on first click */
  @HostListener('document:click', ['$event']) dismissTooltip() {
    this.mapTooltip.hide();
    this.tooltipEnabled = false;
  }

  /** Block map clicks on touch device if the cards are expanded */
  @HostListener('document:touchstart', ['$event']) onTouchStart() {
    this.blockMapClick = !this.mapToolService.cardsCollapsed;
  }

  /**
   * Sets the visibility on a layer group
   * @param mapLayer the layer group that was selected
   * @param sourceId where the layer group is being set from
   */
  setGroupVisibility(layerGroup: MapLayerGroup, sourceId?: string) {
    if (layerGroup && layerGroup.id === 'auto') { this.autoSwitch = true; return; }
    if (this._mapInstance) {
      // Only change data level and turn off auto switch if wasn't already
      // changed by the onMapZoom event handler
      if (this.selectedLayer !== layerGroup) {
        this.selectedLayer = layerGroup;
        this.autoSwitch = false;
        this.restoreAutoSwitch = false;
        if (sourceId && sourceId === 'dropdown') {
          this.layerChangedFromDropdown.emit(this.selectedLayer);
        }
      }
      this.layerOptions.forEach((group: MapLayerGroup) => {
        this.mapService.setLayerGroupVisibility(group, (group.id === layerGroup.id));
      });
      // Reset the hover layer
      this.mapService.setHoveredFeature(null);
    }
  }

  /**
   * Set the map instance, the data level, highlight layer, current year, and zoom
   * handler when the map is ready
   * @param map mapbox instance
   */
  onMapReady(map) {
    this._mapInstance = map;
    this.mapService.setMapInstance(map);
    this.setGroupVisibility(this.selectedLayer);
    this.updateCensusYear();
    this.updateMapData();
    if (this.boundingBox) {
      this.mapService.zoomToBoundingBox(this.boundingBox);
      // Only toggle if autoSwitch is currently on
      if (this.autoSwitch) {
        this.autoSwitch = false; // needs to be off when navigating to a param location
        this.restoreAutoSwitch = true; // restore auto switch after zoom
      }
    }
  }

  /**
   * Set the zoom value for the app, auto adjust layers if enabled
   * @param zoom the current zoom level of the map
   */
  onMapZoomEnd(zoom) {
    this.zoom = zoom;
    if (this.selectedLayer && this.selectedLayer.minzoom > zoom) {
      this.autoSwitch = true;
    }
    if (this.autoSwitch) {
      const visibleGroups = this.mapService.filterLayerGroupsByZoom(this.layerOptions, zoom);
      if (visibleGroups.length > 0) {
        if (this.selectedLayer !== visibleGroups[0]) {
          this.selectedLayer = visibleGroups[0];
          this.trackAutoSwitch(visibleGroups[0]);
        }
      }
    }
  }

  enableZoom() { return this.mapService.enableZoom(); }
  disableZoom() { return this.mapService.disableZoom(); }

  /**
   * Emits the new bounds of the current map view anytime the map finishes moving
   * @param e the moveend event
   */
  onMapMoveEnd(e) {
    this._store.bounds = this.mapService.getBoundsArray()
      .reduce((a, b) => a.concat(b))
      .map(v => Math.round(v * 1000) / 1000);
    if (this.scrollZoom) {
      this.boundingBoxChange.emit(this._store.bounds);
      if (this.restoreAutoSwitch) { this.autoSwitch = true; }
      this.updateHighlights();
    }
  }

  /**
   * Activates a feature if it is currently in a "hovered" state
   * If the feature is not yet in a "hovered" state, set the feature
   * as hovered.
   * @param feature the map feature
   */
  onFeatureClick(feature) {
    // collapse cards if they are not collapsed
    if (!this.mapToolService.cardsCollapsed) {
      this.mapToolService.cardsCollapsed = true;
    }
    // emit feature click if not event blocking
    if (feature && feature.properties && !this.blockMapClick) {
      this.featureClick.emit(feature);
    }
    // turn off event blocking so future clicks work
    this.blockMapClick = false;
  }

  /** Tracks anytime the map auto switches based on zoom level */
  private trackAutoSwitch(mapLayer: any) {
    this.analytics.trackEvent('zoomUse', { zoomLevel: mapLayer.id });
  }

  /**
   * Updates the active feature highlights and caches the geometry if it is at
   * a higher detail level.
   */
  private updateHighlights() {
    const updatedFeatures =
      this.mapService.updateHighlightFeatures(this.activeFeatures);
    // do not update if active features / updated features are unavailable (issue #1139)
    // or if the updated features are not the same as the highlighted features (issue #1174)
    if (!this.mapService.areSameFeatures(this.activeFeatures, updatedFeatures)) { return; }
    // update geometries in place if higher detail
    for (let i = 0; i < this.activeFeatures.length; i++) {
      const f1 = this.activeFeatures[i];
      const f2 = updatedFeatures[i];
      if (
        !f1.properties['geoDepth'] ||
        f1.properties['geoDepth'] < f2.properties['geoDepth']
      ) {
        f1.properties['geoDepth'] = f2.properties['geoDepth'];
        f1.geometry = f2.geometry;
      }
    }
  }

  /**
   * Gets the currently active data attribute with the year appended
   * @param type either 'choropleth' or 'bubble'
   */
  private getAttributeWithYear(type: string) {
    const data = (type === 'choropleth') ? this.selectedChoropleth : this.selectedBubble;
    return this.addYearToObject(data, this.year);
  }

  /**
   * Add year to data attribute or level from selector
   * returns a new object so the original is not mutated
   * @param dataObject
   * @param year
   */
  private addYearToObject(dataObject: MapDataObject, year: number): MapDataObject {
    if (!dataObject) { return null; }
    const newObj = { ...dataObject };
    if (/.*\d{2}.*/g.test(newObj.id)) {
      newObj.id = newObj.id.replace(/\d{2}/g, ('' + year).slice(2));
    } else {
      newObj.id += '-' + ('' + year).slice(2);
    }
    return newObj;
  }

  /**
   * Checks to see if the current year is in a different census source
   * and updates if it is.
   */
  private updateCensusYear() {
    // Get census year, check if changed, update sources only if it did
    const censusYear = this.yearToCensusYear(this.year);
    if (this.censusYear !== censusYear) {
      this.censusYear = censusYear;
      this.mapService.updateCensusSource(this.layerOptions, ('' + this.censusYear).slice(2));
    }
  }

  /**
   * Convert any year to the nearest decennial census year
   * @param year
   */
  private yearToCensusYear(year: number) {
    return Math.floor(year / 10) * 10;
  }

  /**
   * Updates the selected layer's name with the word "auto" if
   * auto switch is enabled
   */
  private updateSelectedLayerName() {
    const autoLabel = `<span>(${this.translatePipe.transform('MAP.AUTO')})</span>`;
    if (this._store.layer) {
      const layerId = this._store.layer.id;
      const layerOptions = this.layerOptions.filter(l => l.id === layerId);
      // Use updated layer option if available since it will be translated
      const layer = layerOptions.length > 0 ? layerOptions[0] : this._store.layer;
      const strippedName = layer.name.replace(autoLabel, '');
      this._store.layer = this.autoSwitch ?
        { ...layer, name: strippedName + autoLabel } :
        { ...layer, name: strippedName };
    }
  }

  /**
   * Updates card properties to correspond to selected data
   */
  private updateCardProperties() {
    if (
      this.bubbleOptions.length === 0 || this.choroplethOptions.length === 0 ||
      !this.selectedBubble || !this.selectedChoropleth
    ) { return; }
    const bubbleStat = (this.selectedBubble.id.includes('none')) ?
      this.bubbleOptions[1] : this.selectedBubble;
    const choroStat = (!this.selectedChoropleth || this.selectedChoropleth.id.includes('none')) ?
      null : this.selectedChoropleth;
    const bubbleAttr = bubbleStat.id.split('-')[0];
    const cardProps = (bubbleAttr === 'er' || bubbleAttr === 'none') ? ['er', 'e'] : ['efr', 'ef'];
    if (choroStat) { cardProps.push(choroStat.id.split('-')[0]); }
    this.cardProps = cardProps.map(p => this.dataAttributes.find(p2 => p === p2.id));
    console.log('updateCardProperties', this.cardProps)
  }

  /**
   * Updates the bubbles on the map, based on the current year ans selected
   * bubble attribute.
   */
  private updateMapBubbles() {
    if (this._mapInstance) {
      const bubble = this.addYearToObject(this.selectedBubble, this.year) as MapDataAttribute;
      if (bubble) {
        this.mapEventLayers.forEach((layerId) => {
          const expression: any = (bubble.expressions[layerId] ?
            bubble.expressions[layerId] : bubble.expressions['default']);

          if (!bubble.id.startsWith('none')) {
            this.mapService.setLayerFilter(`${layerId}_bubbles`, undefined);
            expression[2][1] = bubble.id;
            this.mapService.setLayerStyle(`${layerId}_bubbles`, 'circle-radius', expression);
            this.mapService.setLayerStyle(`${layerId}_bubbles`, 'circle-color', [
              'case', ['<', ['number', ['get', bubble.id]], 0],
              'rgba(255,255,255,0.65)', 'rgba(255,4,0,0.65)'
            ]);
            this.mapService.setLayerStyle(`${layerId}_bubbles`, 'circle-stroke-color', [
              'case', ['<', ['number', ['get', bubble.id]], 0],
              'rgba(128,128,128,1)', 'rgba(255,255,255,1)'
            ]);
          } else {
            this.mapService.setLayerFilter(`${layerId}_bubbles`, ['has', bubble.id]);
          }
        });
      }
    }
  }

  /**
   * Updates the choropleths on the map, based on the current year ans selected
   * choropleth attribute.
   */
  private updateMapChoropleths() {
    if (this._mapInstance) {
      const choropleth =
        this.addYearToObject(this.selectedChoropleth, this.year) as MapDataAttribute;
      if (choropleth) {
        this.mapEventLayers.forEach((layerId) => {
            const stops = choropleth.stops[layerId] ?
              choropleth.stops[layerId] : choropleth.stops['default'];
            if (!choropleth.id.startsWith('none')) {
              const newFill = ['interpolate', ['linear'], ['get', choropleth.id], ...stops];
              this.mapService.setLayerStyle(layerId, 'fill-color', newFill);
            } else {
              this.mapService.setLayerStyle(layerId, 'fill-color', choropleth.default);
            }
            this.mapService.setLayerFilterProperty(`${layerId}_null`, choropleth.id);
        });
      }
    }
  }

  /**
   * Updates the bubbles and choropleths on the map with the currently
   * selected layer, bubble, choropleth, and year.
   */
  private updateMapData() {
    this.updateMapBubbles();
    this.updateMapChoropleths();
    this.updateHighlights();
  }

}
