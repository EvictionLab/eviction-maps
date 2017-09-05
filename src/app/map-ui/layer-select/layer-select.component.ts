import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapLayer } from '../map-layer';

@Component({
  selector: 'app-layer-select',
  templateUrl: './layer-select.component.html',
  styleUrls: ['./layer-select.component.css']
})
export class LayerSelectComponent implements OnInit {
  public selectedLayer: MapLayer;
  @Input() layers: Array<MapLayer> = [];
  @Output() change: EventEmitter<MapLayer> = new EventEmitter<MapLayer>();

  constructor() { }

  /**
   * set the selected layer to the first item, or none if there are no layers
   */
  ngOnInit() {
    this.selectedLayer =
      this.layers.length > 0 ? this.layers[0] : { id: 'none', name: 'None' };
  }

  /**
   * sets the selected layer for the component and emits the new value
   * @param newLayer the new map layer that was selected
   */
  changeLayer(newLayer: MapLayer): void {
    if (newLayer.id === this.selectedLayer.id) { return; }
    this.selectedLayer = newLayer;
    this.change.emit(newLayer);
  }

}
