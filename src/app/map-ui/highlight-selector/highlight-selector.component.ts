import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MapDataAttribute } from '../../map/map-data-attribute';

@Component({
  selector: 'app-highlight-selector',
  templateUrl: './highlight-selector.component.html',
  styleUrls: ['./highlight-selector.component.css']
})
export class HighlightSelectorComponent implements OnInit {
  selectedAttribute: MapDataAttribute;
  @Input() attributes: Array<MapDataAttribute> = [];
  @Output() change: EventEmitter<MapDataAttribute> = new EventEmitter<MapDataAttribute>();

  constructor() { }

  ngOnInit() {
    // this.selectedAttribute = this.attributes[0];
    this.selectedAttribute = this.attributes.length ? this.attributes[0] : null;
  }

  changeAttribute(attr: MapDataAttribute) {
    this.selectedAttribute = attr;
    this.change.emit(attr);
  }

}
