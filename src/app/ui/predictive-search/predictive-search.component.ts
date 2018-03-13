import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { TypeaheadModule, TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-predictive-search',
  templateUrl: './predictive-search.component.html',
  styleUrls: ['./predictive-search.component.scss']
})
export class PredictiveSearchComponent implements OnInit {
  @Input() selected: any;
  @Input() optionField: string;
  @Input() options: Object[];
  @Input() optionsLimit = 5;
  @Input() waitMs = 500;
  @Input() placeholder;
  @Output() selectedChange = new EventEmitter();
  @Output() selectionChange: EventEmitter<Object> = new EventEmitter<Object>();
  ariaOwns = 'results';
  ariaActiveDescendant: string;
  ariaExpanded = false;
  private typedValue: string;
  private selectedIndex = 0;
  private _enteredText;
  private _keyboardSelected;

  constructor(public el: ElementRef) { }

  ngOnInit() { }

  @HostListener('keydown', [ '$event' ]) onkeypress(e) {
    const keys = { 'UP': 38, 'DOWN': 40, 'ESC': 27 };
    const items = this.el.nativeElement.querySelectorAll('.dropdown-menu li');
    if (!items) { return; }
    if (e.keyCode === keys['DOWN']) {
      this.selectedIndex++;
      if (this.selectedIndex === this.optionsLimit) { this.selectedIndex = 0; }
      this.selected = this.stripWhitespace(items[this.selectedIndex].textContent);
    } else if (e.keyCode === keys['UP'] && this.selectedIndex > -1) {
      this.selectedIndex--;
      if (this.selectedIndex === -1) { this.selectedIndex = this.optionsLimit - 1; }
      this.selected = this.stripWhitespace(items[this.selectedIndex].textContent);
    } else if (e.keyCode === keys['ESC']) {
      this.clearSelection();
    } else {
      this.selectedIndex = 0;
    }
    this.updateAria();
  }

  @HostListener('click', [ '$event' ]) onClick(e) {
    // clear keyboard selection on click
    this.selectedIndex = 0;
  }

  /** Sets or updates the appropriate aria values on the predictive search */
  updateAria() {
    const menu = this.el.nativeElement.querySelector('.dropdown-menu');
    if (menu) {
      this.ariaExpanded = true;
      menu.setAttribute('id', this.ariaOwns);
      menu.setAttribute('role', 'listbox');
      const items = this.el.nativeElement.querySelectorAll('.dropdown-menu li');
      if (items && items.length > 0 && items.length > this.selectedIndex) {
        this.ariaActiveDescendant = 'selectedOption';
        items.forEach(i => {
          i.removeAttribute('id');
          i.setAttribute('aria-selected', 'false');
          i.setAttribute('role', 'option');
        });
        items[this.selectedIndex].setAttribute('id', this.ariaActiveDescendant);
        items[this.selectedIndex].setAttribute('aria-selected', 'true');
      } else {
        this.ariaActiveDescendant = null;
      }
    } else {
      this.ariaExpanded = false;
    }
  }

  /**
   * ngx-bootstrap typeahead automatically sets the "active" class on the first
   * item, but we only want it selected if the user goes to it specifically.  In
   * this component, we maintain a `selectedIndex` property that indicates which
   * item should be active.
   */
  overrideActiveItem(items) {
    items.forEach(el => { el.className = ''; });
    if (this.selectedIndex > -1 && items[this.selectedIndex]) {
      items[this.selectedIndex].className = 'active-override';
    }
  }

  /** Strip any whitespace characters from text */
  stripWhitespace(text: string) {
    return text.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
  }

  /** Reset the selected index and value on blur */
  clearSelection(e?) {
    this.selectedIndex = 0;
    this.selected = null;
  }

  /**
   * Updates the ngModel value and emits it for parent components
   * @param selectedText updated ngModel value
   */
  selectedTextChange(selectedText) {
    // track typed value so we can emit for analytics
    if (this.selected && selectedText && this.isTermTyped(this.selected, selectedText)) {
      this.typedValue = selectedText;
    }
    this.selected = selectedText;
    this.selectedChange.emit(selectedText);
  }

  /**
   * Emit the selection object on typeahead select
   * @param selection object returned from selection
   */
  updateSelection(selection: TypeaheadMatch = null) {
    this.selected = selection ? selection.value : selection;
    this.selectionChange.emit({
      selection: selection ? selection.item : selection,
      queryTerm: this.typedValue
    });
    // clear the selection after selected and emitted
    this.selected = null;
  }

  /**
   * Assuming typed search terms change one character at a time.
   * Not completely accurate, but good enough for tracking purposes.
   */
  private isTermTyped(str1: string, str2: string) {
    return Math.abs(str1.length - str2.length) === 1;
  }

}
