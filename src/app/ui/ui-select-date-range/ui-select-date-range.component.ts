import {
  Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, HostBinding, ElementRef
} from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import * as _isEqual from 'lodash.isequal';

@Component({
  selector: 'app-ui-select-date-range',
  templateUrl: './ui-select-date-range.component.html',
  styleUrls: ['./ui-select-date-range.component.scss']
})
export class UiSelectDateRangeComponent implements OnInit {


  constructor(public el: ElementRef) {}

  /**
   * set the selected value to the first item if no selected value is given
   */
  ngOnInit() {

  }

}
