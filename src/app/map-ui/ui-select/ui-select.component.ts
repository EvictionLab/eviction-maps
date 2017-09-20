import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapLayerGroup } from '../../map/map-layer-group';
import * as _isEqual from 'lodash.isequal';


@Component({
  selector: 'app-ui-select',
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.scss']
})
export class UiSelectComponent implements OnInit {
  @Input() labelProperty: string; // only provided if values are an object
  @Input() selectedValue: any;
  @Input() values: Array<any> = [];
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  get selectedLabel(): string { return this.getLabel(this.selectedValue); }
  private stringArray = false;

  /**
   * set the selected value to the first item if no selected value is given
   */
  ngOnInit() {
    if (this.values.length) {
      this.stringArray = (typeof this.values[0] === 'string');
      if (!this.selectedValue) {
        this.selectedValue = this.values[0];
      }
    }
  }

  /**
   * Gets the value from `labelProperty` on the value object, or
   * returns the string value if `values` is a string array.
   * @param value
   */
  getLabel(value) {
    return (
      this.stringArray ? value : value[this.labelProperty]
    );
  }

  /**
   * sets the selected value for the component and emit the new value
   * @param newValue the new map value that was selected
   */
  changeValue(newValue: any): void {
    if (_isEqual(newValue, this.selectedValue)) { return; }
    this.selectedValue = newValue;
    this.change.emit(newValue);
  }

}
