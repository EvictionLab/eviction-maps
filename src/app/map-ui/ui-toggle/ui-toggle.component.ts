import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ui-toggle',
  templateUrl: './ui-toggle.component.html',
  styleUrls: ['./ui-toggle.component.scss']
})
export class UiToggleComponent implements OnInit {

  @Input() values = [];
  @Input() labelProperty = 'name';
  @Input()
  get selectedValue() { return this._selectedValue; }
  set selectedValue(val) {
    if (val !== this._selectedValue) {
      this._selectedValue = val;
      this.selectedValueChanged.emit(this._selectedValue);
    }
  }
  @Output() selectedValueChanged = new EventEmitter();
  private _selectedValue;

  /**
   * Set default value if not already set
   */
  ngOnInit() {
    if (!this.selectedValue && this.values.length) { this.selectedValue = this.values[0]; }
  }

}
