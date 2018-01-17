import {
  Component, OnInit, Input, Output, AfterViewInit,
  EventEmitter, ViewChild, ElementRef, NgZone, HostListener
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MapService } from '../map.service';
import { MapLayerGroup } from '../../map/map-layer-group';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent implements AfterViewInit {
  private map: mapboxgl.Map;
  private activeFeature: any;
  @ViewChild('map') mapEl: ElementRef;
  @Input() mapConfig: Object;
  @Input() eventLayers: Array<string> = [];
  @Input() selectedLayer: MapLayerGroup;
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @Output() zoom: EventEmitter<number> = new EventEmitter();
  @Output() moveEnd: EventEmitter<Array<number>> = new EventEmitter();
  @Output() featureClick: EventEmitter<number> = new EventEmitter();
  featureMouseMove: EventEmitter<any> = new EventEmitter();
  featureMouseLeave: EventEmitter<any> = new EventEmitter();

  constructor(private mapService: MapService, private zone: NgZone) { }

  /**
   * Create map object from mapEl ViewChild
   */
  ngAfterViewInit() {
    this.map = this.mapService.createMap({
      ...this.mapConfig, container: this.mapEl.nativeElement, attributionControl: false
    });
    this.map.addControl(new mapboxgl.AttributionControl(), 'bottom-left');
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    this.map.addControl(new mapboxgl.GeolocateControl({showUserLocation: false}), 'top-left');
    this.map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'top-left');
    this.map.on('load', () => {
      this.onMapInstance(this.map);
    });
    this.map.on('error', (e) => {
      if (e && e.error && e.error.tile && e.error.tile.state === 'Errored') {
      } else {
        console.error(e);
      }
    });
  }

  /** passes focus to the map canvas */
  @HostListener('focus', ['$event']) onfocus(e) {
    this.mapEl.nativeElement.getElementsByTagName('canvas')[0].focus();
  }

  /**
   * Pass any .on() calls to the map instance
   * @param args any amount of arguments that would be passed to mapboxgl's .on()
   */
  on(...args: any[]) { return this.map.on.apply(this.map, arguments); }

  onMouseEnterFeature() { this.map.getCanvas().style.cursor = 'pointer'; }

  onMouseLeaveFeature() {
    this.map.getCanvas().style.cursor = '';
    this.activeFeature = null;
    this.mapService.setSourceData('hover');
  }

  onMouseMoveFeature(e) {
    if (e.features.length) {
      const feature = e.features[0];
      if (
        !this.activeFeature ||
        this.activeFeature.properties.n !== feature.properties.n ||
        this.activeFeature.properties.pl !== feature.properties.pl
      ) {
        this.activeFeature = feature;
        if (feature && feature.layer.id === this.selectedLayer.id) {
          const union = this.mapService.getUnionFeature(this.selectedLayer.id, feature);
          if (union !== null) {
            this.mapService.setSourceData('hover', [union]);
          }
        } else {
          this.mapService.setSourceData('hover');
        }
      }
    }
  }

  /**
   * when the map is ready, bind the events
   * @param map mapbox instance
   */
  onMapInstance(map) {
    this.map = map;
    this.setupEmitters();
    this.zone.runOutsideAngular(() => {
      this.featureMouseMove
        .debounceTime(100)
        .subscribe(e => this.onMouseMoveFeature(e));
      this.featureMouseLeave
        .debounceTime(100)
        .subscribe(e => this.onMouseLeaveFeature());
    });
    this.ready.emit(this.map);
  }

  /**
   * Bind to map events for zoom and any specified event layers
   */
  private setupEmitters() {
    // Emit all zoom end events from map
    this.map.on('moveend', (e) => this.moveEnd.emit(e));
    // Emit feature on zoom end to account for geography details changing across zooms
    this.map.on('zoomend', () => this.zoom.emit(this.map.getZoom()));
    this.map.on('data', (e) =>  this.mapService.setLoading(!this.map.areTilesLoaded()));
    this.map.on('dataloading', (e) => this.mapService.setLoading(!this.map.areTilesLoaded()));
    this.eventLayers.forEach((layer) => {
      this.map.on('mouseenter', layer, (ev) => this.onMouseEnterFeature());
      this.map.on('mouseleave', layer, (ev) => this.featureMouseLeave.emit(ev));
      this.map.on('mousemove', layer, (ev) => this.featureMouseMove.emit(ev));
      this.map.on('click', layer, (e) => {
        if (e.features.length) {
          this.featureClick.emit(e.features[0]);
        }
      });
    });
  }
}
