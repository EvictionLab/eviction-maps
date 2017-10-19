import {
  Component, OnInit, Input, Output, AfterViewInit, EventEmitter, ViewChild, ElementRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MapService } from '../map.service';
import { MapLayerGroup } from '../../map/map-layer-group';

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
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @Output() zoom: EventEmitter<number> = new EventEmitter();
  @Output() moveEnd: EventEmitter<Array<number>> = new EventEmitter();
  @Output() render: EventEmitter<any> = new EventEmitter();
  @Output() featureClick: EventEmitter<number> = new EventEmitter();
  @Output() featureMouseEnter: EventEmitter<any> = new EventEmitter();
  @Output() featureMouseLeave: EventEmitter<any> = new EventEmitter();
  @Output() featureMouseMove: EventEmitter<any> = new EventEmitter();
  @Output() hoverChanged: EventEmitter<any> = new EventEmitter();

  constructor(private mapService: MapService) { }

  /**
   * Create map object from mapEl ViewChild
   */
  ngAfterViewInit() {
    this.map = this.mapService.createMap({
      ...this.mapConfig, container: this.mapEl.nativeElement
    });
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    this.map.addControl(new mapboxgl.GeolocateControl({showUserLocation: false}), 'top-left');
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

  /**
   * Pass any .on() calls to the map instance
   * @param args any amount of arguments that would be passed to mapboxgl's .on()
   */
  on(...args: any[]) { return this.map.on.apply(this.map, arguments); }

  onMouseEnterFeature() { this.map.getCanvas().style.cursor = 'pointer'; }

  onMouseLeaveFeature() {
    this.map.getCanvas().style.cursor = '';
    this.activeFeature = null;
    this.hoverChanged.emit(this.activeFeature);
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
        this.hoverChanged.emit(this.activeFeature);
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
    this.featureMouseEnter.subscribe(this.onMouseEnterFeature.bind(this));
    this.featureMouseLeave.subscribe(this.onMouseLeaveFeature.bind(this));
    this.featureMouseMove.subscribe(this.onMouseMoveFeature.bind(this));
    this.ready.emit(this.map);
  }

  /**
   * Bind to map events for zoom and any specified event layers
   */
  private setupEmitters() {
    // Emit all zoom end events from map
    this.map.on('moveend', (e) => { this.moveEnd.emit(e); });
    this.map.on('zoom', (zoomEvent) => { this.zoom.emit(this.map.getZoom()); });
    this.map.on('render', (e) => {
      this.render.emit(e);
      this.mapService.setLoading(!this.map.loaded());
    });
    this.eventLayers.forEach((layer) => {
      this.map.on('click', layer, (e) => {
        if (e.features.length) {
          this.featureClick.emit(e.features[0]);
        }
      });
      this.map.on('mouseenter', layer, (e) => { this.featureMouseEnter.emit(e); });
      this.map.on('mouseleave', layer, (e) => { this.featureMouseLeave.emit(e); });
      this.map.on('mousemove', layer, (e) => { this.featureMouseMove.emit(e); });
    });
  }
}
