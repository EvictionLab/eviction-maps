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
  get selectedLabel(): string { return this.getLabel(this.selectedValue); }
  focusIndex = 0;
  private valuesArray = true; // true if `values` is an array of values instead of objects
  @HostBinding('class.open') open = false;
  /** Tracks if the "none" option is selected */
  @HostBinding('class.none-selected') noneSelected = true;
  private touchStartY: number;
  private _selectedValue;
  private scrollMax = 0;
  private listEls = [];
  private listTimeout = null;

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

  /**
   * Set open status, reset scrollTop in dropdown
   */
  onIsOpenChange() {
    this.open = this.dropdown.isOpen;
    if (this.dropdownList) {
      this.dropdownList.nativeElement.scrollTop = 0;
      this.setScrollMax();
      if (this.open) {

      }
    }
  }

  /**
   * Set the DOM elements in the list
   * NOTE: There is a slight delay before the dropdown list element is in the DOM
   *  so there is a timeout that gets called to try again in 200ms if it's not there yet
   */
  setListEls() {
    if (this.dropdownList) {
      const currentIndex = this.values.findIndex((v) => this.selectedValue === v);
      this.focusIndex = currentIndex > -1 ? currentIndex : 0;
      this.listEls = this.dropdownList.nativeElement.getElementsByClassName('dropdown-item');
      // sometimes the menu toggle button steals focus when opening the menu
      // this timeout ensures the currently selected item gets focus when the menu opens
      setTimeout(() => { this.listEls[this.focusIndex].focus(); }, 10);
    } else {
      if (this.listTimeout) { clearTimeout(this.listTimeout); }
      this.listTimeout = setTimeout(() => { this.setListEls(); }, 200);
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    const keys = { 'SPACE': 32, 'ENTER': 13, 'UP': 38, 'DOWN': 40, 'ESC': 27, 'TAB': 9 };
    if (this.dropdown.isOpen) {
      if (e.keyCode === keys['UP'] || e.keyCode === keys['DOWN']) {
        // go to next item
        this.switchFocus(e.keyCode === keys['UP']);
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.keyCode === keys['SPACE'] || e.keyCode === keys['ENTER']) {
        // select item and close
        this.selectedValue = this.values[this.focusIndex];
        this.dropdown.hide();
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.keyCode === keys['ESC'] || e.keyCode === keys['TAB']) {
        // close without selecting item
        this.dropdown.hide();
      }
    } else {
      if (e.keyCode === keys['UP'] || e.keyCode === keys['DOWN']) {
        // open the menu
        this.dropdown.show();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  onSelectScroll(e) {
    this.onPageMove(e, e.deltaY);
  }

  onSelectTouchStart(e) {
    this.touchStartY = e.touches[0].pageY;
  }

  onSelectTouchMove(e) {
    this.onPageMove(e, this.touchStartY - e.touches[0].pageY);
  }

  /** Close the dropdown when the page starts scrolling */
  @HostListener('document:scroll', ['$event'])
  onDocumentScroll(e) {
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

  /** Switches focus to the previous or next list item */
  private switchFocus(previous: boolean) {
    const modulo = (n, m) => ((n % m) + m) % m;
    const newIndex = (previous ? this.focusIndex - 1 : this.focusIndex + 1);
    this.focusIndex = modulo(newIndex, this.listEls.length);
    this.listEls[this.focusIndex].focus();
  }

  /** Sets the maximum amount the list is able to scroll */
  private setScrollMax() {
    this.scrollMax =
      this.dropdownList.nativeElement.scrollHeight - this.dropdownList.nativeElement.clientHeight;
  }

}
