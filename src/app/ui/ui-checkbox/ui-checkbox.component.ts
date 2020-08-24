import { Component, HostBinding, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrls: ['./ui-checkbox.component.scss']
})
export class UiCheckboxComponent {

  @Input() isChecked: boolean;
  @Input()
  set checked(value) {
    if (value === this.isChecked) { return; }
    this.isChecked = value;
    this.changed.emit(value);
  }
  get on() { return this.isChecked; }
  @Output() changed = new EventEmitter<boolean>();
  @Input() inputLabel: string;
  @Input() index: number;

}
