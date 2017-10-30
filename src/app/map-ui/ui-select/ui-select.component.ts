import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { MapLayerGroup } from '../../map/map-layer-group';
import * as _isEqual from 'lodash.isequal';


@Component({
  selector: 'app-ui-select',
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.scss']
})
export class UiSelectComponent implements OnInit {
  @Input() label: string; // optional label for the select dropdown
  @Input() labelProperty: string; // only provided if values are an object
  @Input() disabledProperty: string; // optional, for objects. boolean for disabled
  @Input()
  set selectedValue(newValue) {
    if (_isEqual(newValue, this._selectedValue)) { return; }
    this._selectedValue = newValue;
    this.change.emit(newValue);
  }
  get selectedValue() { return this._selectedValue; }
  @Input() values: Array<any> = [];
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(BsDropdownDirective) dropdown;
  highlightedItem: any;
  get selectedLabel(): string { return this.getLabel(this.selectedValue); }
  private stringArray = false;
  private _selectedValue;

  /**
   * set the selected value to the first item if no selected value is given
   */
  ngOnInit() {
    if (this.values.length) {
      this.stringArray = (typeof this.values[0] === 'string');
      if (!this._selectedValue) {
        this._selectedValue = this.values[0];
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
   * If disabledProperty is set, returns the boolean value from this property
   * @param value
   */
  getDisabled(value): boolean {
    return this.disabledProperty ? value[this.disabledProperty] : false;
  }

  getNextHighlightedItem(previousItem = false) {
    const values = this.disabledProperty ?
      this.values.filter(v => v[this.disabledProperty]) : this.values;
    const i = values.findIndex((v) => _isEqual(this.highlightedItem, v));
    const offset = previousItem ? -1 : 1;
    return values[(i + offset) % values.length];
  }

  @HostListener('keydown', ['$event']) onFocus(e) {
    const keys = { 'SPACE': 32, 'ENTER': 13, 'UP': 38, 'DOWN': 40, 'ESC': 27 };
    if (this.dropdown.isOpen) {
      if (e.keyCode === keys['UP'] || e.keyCode === keys['DOWN']) {
        // go to next item
        this.highlightedItem = this.getNextHighlightedItem((e.keyCode === keys['UP']));
      }
      if (e.keyCode === keys['SPACE'] || e.keyCode === keys['ENTER']) {
        // select item and close
        this.selectedValue = this.highlightedItem;
        this.dropdown.toggle();
      }
      if (e.keyCode === keys['ESC']) {
        // close
        this.dropdown.toggle();
      }
    } else {
      if (e.keyCode === keys['SPACE'] || e.keyCode === keys['UP'] || e.keyCode === keys['DOWN']) {
        // open the menu
        this.dropdown.toggle();
        this.highlightedItem = this.selectedValue;
      }
    }
  }

  @HostListener('blur', ['$event']) onBlur(e) {
    if (this.dropdown.isOpen) { this.dropdown.hide(); }
  }

}
