import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ui-toggle',
  templateUrl: './ui-toggle.component.html',
  styleUrls: ['./ui-toggle.component.scss']
})
export class UiToggleComponent implements OnInit {
  @Input() groupLabel: string;
  @Input() values = [];
  @Input() labelProperty = 'name';
  @Input() valueProperty = 'value';
  @Input()
  get selectedValue() { return this._selectedValue; }
  set selectedValue(val) {
    if (val !== this._selectedValue) {
      this._selectedValue = val;
      this.selectedValueChanged.emit(this._selectedValue);
    }
  }
  @Output() selectedValueChanged = new EventEmitter();
  @HostBinding('attr.role') ariaRole = 'radiogroup';
  private _selectedValue;

  /**
   * Set default value if not already set
   */
  ngOnInit() {
    this.selectedValue = (!this.selectedValue && this.values && this.values.length) ?
      this.values[0] : this.selectedValue;
  }

}
