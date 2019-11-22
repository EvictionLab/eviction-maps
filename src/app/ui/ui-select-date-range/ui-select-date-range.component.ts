import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { UiDropdownComponent } from '../ui-dropdown/ui-dropdown.component';

@Component({
  selector: 'app-ui-select-date-range',
  templateUrl: './ui-select-date-range.component.html',
  styleUrls: ['./ui-select-date-range.component.scss']
})
export class UiSelectDateRangeComponent implements OnInit, AfterViewInit {

  /** label for the dropdown  */
  @Input() label: string;

  /** start range value */
  private _startValue: number;
  @Input() set startValue(value: number) {
    if (value !== this._startValue) {
      this._startValue = value;
    }
  }
  get startValue() { return this._startValue; }

  /** end range value */
  private _endValue: number;
  @Input() set endValue(value: number) {
    if (value !== this._endValue) {
      this._endValue = value;
    }
  }
  get endValue() { return this._endValue; }

  /** all available values */
  @Input() values: Array<number> = [];

  /** formatter function for value label that accepts startValue and endValue */
  @Input() formatter: Function;

  /** Dropdown directive */
  @ViewChild(UiDropdownComponent) uiDropdown: UiDropdownComponent;

  /** Event emitter on change */
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  private _debug = true;
  private _initValueStart: number;
  private _initValueEnd: number;

  constructor(public el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  isValueInvalid(value: number) {
    return !this._endValue && value < this._startValue;
  }

  isValueHighlighted(value: number) {
    return (
      this._startValue &&
      this._endValue &&
      value >= this._startValue &&
      value <= this._endValue
    ) || (
      this._startValue &&
      !this._endValue &&
      this._startValue === value
    );
  }

  isValueFirst(value: number) {
    return this._startValue && value === this._startValue;
  }

  isValueLast(value: number) {
    return this._endValue && value === this._endValue;
  }

  getValueLabel() {
    if (this.formatter) {
      return this.formatter(this.startValue, this.endValue);
    }
    return this.startValue + ' to ' + (this.endValue || '...');
  }

  handleOpenChange(isOpen: boolean) {
    this._initValueStart = this._startValue;
    this._initValueEnd = this._endValue;
  }

  handleClose(cancel: boolean) {
    this.uiDropdown.dropdown.hide();
    this.change.emit({start: this._startValue, end: this._endValue});
  }

  handleCancel(cancel: boolean) {
    this._startValue = this._initValueStart;
    this._endValue = this._initValueEnd;
    this.uiDropdown.dropdown.hide();
  }

  handleYearSelect(value: number) {
    this.debug('handleYearSelect', value);
    // reselecting range
    if (this._startValue && this._endValue) {
      this._startValue = value;
      this._endValue = null;
    }
    // selecting end year
    if (this._startValue && !this._endValue && value > this._startValue) {
      this._endValue = value;
    }
  }

  private debug(...args) {
    // tslint:disable-next-line
    environment.production || !this._debug ?  null : console.debug.apply(console, [ 'map: ', ...args]);
  }

}
