import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-predictive-search',
  templateUrl: './predictive-search.component.html',
  styleUrls: ['./predictive-search.component.scss']
})
export class PredictiveSearchComponent implements OnInit {
  public selected: Object;
  @Input() optionField: string;
  @Input() options: Object[] = [];
  @Input() optionsLimit = 5;
  @Output() selectionChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() { }

  ngOnInit() { }

  /**
   * Emit the selection object on typeahead select
   * @param selection object returned from selection
   */
  updateSelection(selection: Object) {
    this.selected = selection;
    this.selectionChange.emit(selection);
  }

}
