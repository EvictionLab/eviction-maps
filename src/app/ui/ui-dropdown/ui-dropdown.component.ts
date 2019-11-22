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
export class UiDropdownComponent implements OnInit {

  /** label for the dropdown  */
  @Input() label: string;

  /** value to show when closed  */
  @Input() value: string;

  /** Event emitter on change */
  @Output() onOpenChange: EventEmitter<any> = new EventEmitter<any>();

  /** Dropdown directive */
  @ViewChild(BsDropdownDirective) dropdown;

  /** Bind open class when dropdown is open */
  @HostBinding('class.open') open = false;


  constructor(public el: ElementRef) {}

  ngOnInit() { }

  /**
   * Set open status
   */
  onIsOpenChange() {
    this.open = this.dropdown.isOpen;
    this.onOpenChange.emit(this.dropdown.isOpen);
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    const keys = { 'SPACE': 32, 'ENTER': 13, 'UP': 38, 'DOWN': 40, 'ESC': 27, 'TAB': 9 };
    if (this.dropdown.isOpen) {
      if (e.keyCode === keys['SPACE'] || e.keyCode === keys['ENTER']) {
        this.dropdown.hide();
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.keyCode === keys['ESC'] || e.keyCode === keys['TAB']) {
        // close without selecting item
        this.dropdown.hide();
      }
    } else {
      if (
        e.keyCode === keys['UP'] ||
        e.keyCode === keys['DOWN'] ||
        e.keyCode === keys['SPACE'] ||
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
