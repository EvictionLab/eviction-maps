import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import { PlatformService } from './platform.service';


@Injectable()
export class ScrollService {
  defaultScrollOffset = 120;
  defaultDuration = 1000;
  // Easing function pulled from:
  // https://joshondesign.com/2013/03/01/improvedEasingEquations
  defaultEasingLogic = {
    ease: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
  };
  pageScroll: PageScrollService;
  /**
   * Setting position fixed on body will prevent scroll, and setting overflow
   * to scroll ensures the scrollbar is always visible.
   * IE 11 requires an empty string rather than null to unset styles.
   */
  set allowScroll(val: boolean) {
    const changeScroll = (
      !val && this.document.documentElement.scrollTop === 0 &&
      !this.document.documentElement.classList.contains('embedded')
    );
    this.document.body.style.position = changeScroll ? 'fixed' : '';
    this.document.body.style.overflowY = changeScroll ? 'scroll' : '';
  }
  verticalOffset$: Observable<number>;
  scrolledToTop$: Observable<boolean>;
  /** Determines the range that triggers `scrolledToTop` to emit */
  private topOffset = 56;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private platform: PlatformService
  ) {
    // provide observable with top / bottom vertical offset
    this.verticalOffset$ = Observable
      .fromEvent(this.platform.nativeWindow, 'scroll')
      .throttleTime(10, undefined, { trailing: true, leading: true })
      .map(e => this.getVerticalOffset());
    this.scrolledToTop$ = this.verticalOffset$
      .map(offset => offset < this.topOffset)
      .distinctUntilChanged();
  }


  /**
   * Sets up PageScrollConfig with defaults
   */
  setupScroll(serviceInstance: PageScrollService) {
    this.pageScroll = serviceInstance;
    PageScrollConfig.defaultScrollOffset = this.defaultScrollOffset;
    PageScrollConfig.defaultDuration = this.defaultDuration;
    PageScrollConfig.defaultEasingLogic = this.defaultEasingLogic;
  }

  /**
   * Helper method for scrolling to an element on the page
   * @param selector Query selector for element to scroll to
   * @param options Additional parameters for PageScrollOptions object
   */
  scrollTo(selector: string, scrollOptions?: Object) {
    const options = { document: this.document, scrollTarget: selector, ...(scrollOptions || {}) };
    const scrollInstance = PageScrollInstance.newInstance(options);
    this.pageScroll.start(scrollInstance);
  }

  getVerticalOffset() {
    return this.platform.nativeWindow.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop || 0;
  }
}
