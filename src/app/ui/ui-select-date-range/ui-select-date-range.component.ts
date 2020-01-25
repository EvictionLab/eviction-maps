import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, HostBinding
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { UiDropdownComponent } from '../ui-dropdown/ui-dropdown.component';

@Component({
  selector: 'app-ui-select-date-range',
  templateUrl: './ui-select-date-range.component.html',
  styleUrls: ['./ui-select-date-range.component.scss']
})
export class UiSelectDateRangeComponent {

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

  @Input() hint: string;

  /** all available values */
  @Input() values: Array<number> = [];

  /** formatter function for value label that accepts startValue and endValue */
  @Input() formatter: Function;

  /** Dropdown directive */
  @ViewChild(UiDropdownComponent) uiDropdown: UiDropdownComponent;

  /** Event emitter on change */
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  /** Sets backward class when selecting a previous year */
  public selectingBackward: boolean;

  /** Sets forward class when selecting a future year */
  public selectingForward: boolean;

  /** Tracks if a selection is currently being made  */
  public selecting: boolean;

  private _debug = false;
  private _initValueStart: number;
  private _initValueEnd: number;
  private _hoveredValue: number;

  /**
   * Determines if a value should be highlighted when
   * maing a selection.
   * @param value numeric value to check
   */
  isValuePreview(value: number) {
    return (
      // required values
      this.selecting &&
      this._startValue &&
      this._hoveredValue &&
      (
        ( // backwards selection and value in range
          this.selectingBackward &&
          value <= this._startValue &&
          value >= this._hoveredValue
        )
        ||
        ( // forward selection and value in range
          this.selectingForward &&
          value <= this._hoveredValue &&
          value >= this._startValue
        )
      )
    );
  }

  /**
   * Determines if a value should be highlighted
   * @param value
   */
  isValueHighlighted(value: number) {
    return ( // inside the selected range
      this._startValue &&
      this._endValue &&
      value >= this._startValue &&
      value <= this._endValue
    ) || ( // is the selected start value
      this._startValue &&
      !this._endValue &&
      this._startValue === value
    );
  }

  /**
   * Determines if the value is the first in the selected range
   * @param value
   */
  isValueFirst(value: number) {
    return (
      (this._startValue && value === this._startValue) ||
      (this.selecting && this.selectingForward && value === this._startValue) ||
      (this.selecting && this.selectingBackward && value === this._hoveredValue)
    );
  }

  /**
   * Determines if a value is the last in the selected range
   * @param value
   */
  isValueLast(value: number) {
    return (
      (this._endValue && value === this._endValue) ||
      (this.selecting && this.selectingForward && value === this._hoveredValue) ||
      (this.selecting && this.selectingBackward && value === this._startValue)
    );
  }

  /**
   * Gets the text string for the dropdown label
   */
  getValueLabel() {
    if (this.formatter) {
      return this.formatter(this.startValue, this.endValue);
    }
    return this.startValue + ' to ' + (this.endValue || '...');
  }

  /**
   * Handler for when the dropdown opens
   * @param isOpen
   */
  handleOpenChange(isOpen: boolean) {
    this._initValueStart = this._startValue;
    this._initValueEnd = this._endValue;
  }

  /**
   * Handler for when the dropdown closes
   */
  handleApply() {
    this.uiDropdown.dropdown.hide();
    this.change.emit({start: this._startValue, end: this._endValue});
  }

  /**
   * Handler for when the cancel button is pressed
   */
  handleCancel() {
    this._startValue = this._initValueStart;
    this._endValue = this._initValueEnd;
    this.selecting = false;
    this.uiDropdown.dropdown.hide();
  }

  /**
   * Handler for when a value is hovered
   * @param value
   */
  handleYearHover(value: number) {
    this.selectingBackward = value < this._startValue;
    this.selectingForward = value > this._startValue;
    this._hoveredValue = value;
  }

  /**
   * Handler for when a year is selected
   * @param value
   */
  handleYearSelect(value: number) {
    this.debug('handleYearSelect', value);
    // early return if pressing the start year during selection
    if (this._startValue && !this._endValue && value === this._startValue) {
      return;
    }
    if (this._startValue && this._endValue) {
      // reselecting range
      this._startValue = value;
      this._endValue = null;
      this.selecting = true;
    } else if (this._startValue && !this._endValue) {
      // selecting end year
      if (value < this._startValue) {
        this._endValue = this._startValue;
        this._startValue = value;
      } else {
        this._endValue = value;
      }
      this.selecting = false;
    }
  }

  private debug(...args) {
    // tslint:disable-next-line
    environment.production || !this._debug ?  null : console.debug.apply(console, [ 'map: ', ...args]);
  }

}
