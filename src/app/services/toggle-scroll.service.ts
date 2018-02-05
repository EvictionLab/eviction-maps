import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class ToggleScrollService {
  /**
   * Setting position fixed on body will prevent scroll, and setting overflow
   * to scroll ensures the scrollbar is always visible.
   * IE 11 requires an empty string rather than null to unset styles.
   */
  set allowScroll(val: boolean) {
    const changeScroll = !val && this.document.documentElement.scrollTop === 0;
    this.document.body.style.position = changeScroll ? 'fixed' : '';
    this.document.body.style.overflowY = changeScroll ? 'scroll' : '';
  }

  constructor(@Inject(DOCUMENT) private document: any) { }

}
