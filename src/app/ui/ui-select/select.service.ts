import { Injectable, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface SelectItem {
  state: boolean;
  label: string;
}

@Injectable()
export class SelectService {
  private selectOpen: SelectItem = { state: false, label: '' };
  private _selectOpen = new BehaviorSubject<boolean>(false);
  selectOpen$ = this._selectOpen.asObservable();

  constructor() { }

  /**
   * Updates the BehaviorSubject with the changed state, verifying
   * that it's not an unrelated select item being closed based on
   * the label in SelectItem (the 'blur' state fires after a new
   * ui-select is opened)
   * @param open
   */
  setSelectOpen(open: SelectItem) {
    if (!(!open.state && this.selectOpen.label !== open.label)) {
      this.selectOpen = open;
      this._selectOpen.next(open.state);
    }
  }

}
