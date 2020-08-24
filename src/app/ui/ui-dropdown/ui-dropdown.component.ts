import {
  Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, HostBinding, ElementRef
} from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';


/**
 * Generic Dropdown Component
 */

@Component({
  selector: 'app-ui-dropdown',
  templateUrl: './ui-dropdown.component.html',
  styleUrls: ['./ui-dropdown.component.scss']
})
export class UiDropdownComponent {

  /** label for the dropdown  */
  @Input() label: string;

  /** value to show when closed  */
  @Input() value: string;

  /** selector to focus on open */
  @Input() focusSelector: string;

  /** Event emitter on change */
  @Output() onOpenChange: EventEmitter<any> = new EventEmitter<any>();

  /** Dropdown directive */
  @ViewChild(BsDropdownDirective) dropdown;

  /** Bind open class when dropdown is open */
  @HostBinding('class.open') open = false;

  constructor(public el: ElementRef) {}

  /**
   * Set open status
   */
  onIsOpenChange() {
    this.open = this.dropdown.isOpen;
    this.onOpenChange.emit(this.dropdown.isOpen);
    setTimeout(() => {
      this.open ? this._setInnerFocus() : this._restoreFocus();
    }, 100);
  }

  /**
   * Set focus on the proper element when the dropdown opens
   */
  private _setInnerFocus() {
    let focusEl;
    if (this.focusSelector) {
      focusEl = this.el.nativeElement.querySelector(this.focusSelector);
    } else {
      focusEl = this.el.nativeElement.querySelector('.dropdown-menu button');
    }
    if (focusEl) {
      focusEl.focus();
    }
  }

  /**
   * Restore focus to the trigger when the dropdown closes
   */
  private _restoreFocus() {
    const focusEl = this.el.nativeElement.querySelector('button');
    if (focusEl) {
      focusEl.focus();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    const keys = { 'ENTER': 13, 'UP': 38, 'DOWN': 40, 'ESC': 27 };
    if (this.dropdown.isOpen) {
      if (e.keyCode === keys['ENTER']) {
        this.dropdown.hide();
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.keyCode === keys['ESC']) {
        // close without selecting item
        this.dropdown.hide();
      }
    } else {
      if (
        e.keyCode === keys['UP'] ||
        e.keyCode === keys['DOWN'] ||
        e.keyCode === keys['ENTER']
      ) {
        // open the menu
        this.dropdown.show();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

}
