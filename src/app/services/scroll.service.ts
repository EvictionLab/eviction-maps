import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { PlatformService } from './platform.service';


@Injectable()
export class ScrollService {
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
  verticalOffset$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private platform: PlatformService
  ) {
    // provide observable with top / bottom vertical offset
    this.verticalOffset$ = Observable
      .fromEvent(this.platform.nativeWindow, 'scroll')
      .map(e => this.getVerticalOffset());
  }

  private getVerticalOffset() {
    return this.platform.nativeWindow.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop || 0;
  }
}
