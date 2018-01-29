import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class ToggleScrollService {
  /**
   * Setting position fixed on body will prevent scroll, and setting overflow
   * to scroll ensures the scrollbar is always visible.
   */
  set allowScroll(val: boolean) {
    this.document.body.style.position = val ? null : 'fixed';
    this.document.body.style.overflowY = val ? null : 'scroll';
  }

  constructor(@Inject(DOCUMENT) private document: any) { }

}
