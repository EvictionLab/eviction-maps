import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() selectedChange = new EventEmitter();
  @Output() selectionChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() { }

  ngOnInit() { }

  /**
   * Updates the ngModel value and emits it for parent components
   * @param selectedText updated ngModel value
   */
  selectedTextChange(selectedText) {
    this.selected = selectedText;
    this.selectedChange.emit(selectedText);
  }

  /**
   * Emit the selection object on typeahead select
   * @param selection object returned from selection
   */
  updateSelection(selection: TypeaheadMatch = null) {
    this.selected = selection;
    this.selectionChange.emit(selection ? selection.item : selection);
  }

}
