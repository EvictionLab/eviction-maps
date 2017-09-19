import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapLayerGroup } from '../../map/map-layer-group';

@Component({
  selector: 'app-layer-select',
  templateUrl: './layer-select.component.html',
  styleUrls: ['./layer-select.component.scss']
})
export class LayerSelectComponent implements OnInit {
  @Input() selectedLayer: MapLayerGroup;
  @Input() layers: Array<MapLayerGroup> = [];
  @Output() change: EventEmitter<MapLayerGroup> = new EventEmitter<MapLayerGroup>();

  constructor() { }

  /**
   * set the selected layer to the first item, or none if there are no layers
   */
  ngOnInit() {
    if (!this.selectedLayer && this.layers.length) {
      this.selectedLayer = this.layers[0];
    }
  }

  /**
   * sets the selected layer for the component and emits the new value
   * @param newLayer the new map layer that was selected
   */
  changeLayer(newLayer: MapLayerGroup): void {
    if (newLayer.id === this.selectedLayer.id) { return; }
    this.selectedLayer = newLayer;
    this.change.emit(newLayer);
  }

}
