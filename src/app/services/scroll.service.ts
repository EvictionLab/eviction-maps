import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { PageScrollService, PageScrollInstance } from 'ngx-page-scroll-core';

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
    this.document.documentElement.style.position = changeScroll ? 'fixed' : '';
    this.document.documentElement.style.overflowY = changeScroll ? 'scroll' : '';
  }
  verticalOffset$: Observable<number>;
  scrolledToTop$: Observable<boolean>;
  /** Determines the range that triggers `scrolledToTop` to emit */
  private topOffset = 56;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private platform: PlatformService
  ) {
    // kill overscroll on safari so the map is zoomable with
    // mousewheel / trackpad.
    if (this.platform.isSafari) {
      this.platform.nativeWindow.addEventListener('mousewheel', (e) => {
        if (e && e.deltaY < 0) {
          if (
            this.getVerticalOffset() === 0 &&
            e.target.className.indexOf('dropdown-item') === -1
          ) {
            e.preventDefault();
            return false;
          }
        }
      });
    }
    // provide observable with top vertical offset
    this.verticalOffset$ = Observable
      .fromEvent(this.platform.nativeWindow, 'scroll')
      .throttleTime(10, undefined, { trailing: true, leading: true })
      .map((e: any) => this.getVerticalOffset());
    this.scrolledToTop$ = this.verticalOffset$
      .map(offset => offset < this.topOffset)
      .distinctUntilChanged();
  }

  setScrollOffset(offset: number) {
    console.log('TODO: implement scroll offset');
  }

  /**
   * Sets up PageScrollConfig with defaults
   */
  setupScroll(serviceInstance: PageScrollService) {
    this.pageScroll = serviceInstance;
  }

  /**
   * Helper method for scrolling to an element on the page
   * @param selector Query selector for element to scroll to
   * @param options Additional parameters for PageScrollOptions object
   */
  scrollTo(selector: string, scrollOptions?: Object) {
    const options = { document: this.document, scrollTarget: selector, ...(scrollOptions || {}) };
    this.pageScroll.scroll(options);
  }

  getVerticalOffset() {
    return this.platform.nativeWindow.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop || 0;
  }
}
