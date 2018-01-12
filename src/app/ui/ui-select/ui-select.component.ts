import {
  Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, HostBinding, ElementRef
} from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import * as _isEqual from 'lodash.isequal';


@Component({
  selector: 'app-ui-select',
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.scss']
})
export class UiSelectComponent implements OnInit {
  @Input() label: string; // optional label for the select dropdown
  @Input() labelProperty: string; // only provided if values are an object
  @Input() bottomLabel: string;
  @Input()
  set selectedValue(newValue) {
    if (_isEqual(newValue, this._selectedValue)) { return; }
    this._selectedValue = newValue;
    this.noneSelected = !this._selectedValue ||
      (this._selectedValue.id && this._selectedValue.id === 'none');
    this.change.emit(newValue);
  }
  get selectedValue() { return this._selectedValue; }
  @Input() values: Array<any> = [];
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(BsDropdownDirective) dropdown;
  @ViewChild('dropdownList') dropdownList: ElementRef;
  highlightedItem: any;
  get selectedLabel(): string { return this.getLabel(this.selectedValue); }
  private valuesArray = true; // true if `values` is an array of values instead of objects
  @HostBinding('class.open') open = false;
  /** Tracks if the "none" option is selected */
  @HostBinding('class.none-selected') noneSelected = true;
  private touchStartY: number;
  private _selectedValue;
  private scrollMax = 0;

  /**
   * set the selected value to the first item if no selected value is given
   */
  ngOnInit() {
    if (this.values && this.values.length) {
      this.valuesArray = (typeof this.values[0] === 'string' || typeof this.values[0] === 'number');
      if (!this._selectedValue) {
        this._selectedValue = this.values[0];
      }
      this.noneSelected = !this._selectedValue ||
        (this._selectedValue.id && this._selectedValue.id === 'none');
    }
  }

  /**
   * Gets the value from `labelProperty` on the value object, or
   * returns the string value if `values` is a string array.
   * @param value
   */
  getLabel(value) {
    return (
      this.valuesArray ? value : value[this.labelProperty]
    );
  }

  getNextHighlightedItem(previousItem = false) {
    const i = this.values.findIndex((v) => _isEqual(this.highlightedItem, v));
    const offset = previousItem ? -1 : 1;
    return this.values[(i + offset) % this.values.length];
  }

  /**
   * Set open status, reset scrollTop in dropdown
   */
  onIsOpenChange() {
    this.open = this.dropdown.isOpen;
    if (this.dropdownList) {
      this.dropdownList.nativeElement.scrollTop = 0;
      this.setScrollMax();
    }
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

  onSelectScroll(e) {
    this.onPageMove(e, e.deltaY);
  }

  onSelectTouchStart(e) {
    console.log('touchstart select');
    this.touchStartY = e.pageY;
  }

  onSelectTouchMove(e) {
    console.log('touchmove event');
    this.onPageMove(e, e.pageY - this.touchStartY);
  }

  /** Close the dropdown when the page starts scrolling */
  @HostListener('document:scroll', ['$event']) onDocumentScroll(e) {
    if (this.dropdown.isOpen) { this.dropdown.hide(); }
  }

  @HostListener('blur', ['$event']) onBlur(e) {
    if (this.dropdown.isOpen) { this.dropdown.hide(); }
  }

  /** Do not propagate any menu wheel events to parent elements */
  private onPageMove(e: any, deltaY: number) {
    if (!this.scrollMax) { this.setScrollMax(); }
    if (deltaY > 0) {
      if (this.dropdownList.nativeElement.scrollTop >= this.scrollMax) {
        // scrolled to the bottom of the dropdown list, ignore wheel events
        e.stopPropagation();
        e.preventDefault();
        e.returnValue = false;
        return false;
      }
    } else if (deltaY < 0) {
      if (this.dropdownList.nativeElement.scrollTop <= 0) {
        // scrolled to the bottom of the dropdown list, ignore wheel events
        e.stopPropagation();
        e.preventDefault();
        e.returnValue = false;
        return false;
      }
    }
  }

  private setScrollMax() {
    this.scrollMax =
      this.dropdownList.nativeElement.scrollHeight - this.dropdownList.nativeElement.clientHeight;
  }

}
