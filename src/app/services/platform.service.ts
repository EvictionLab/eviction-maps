import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';

function _window(): any {
  // return the global native browser window object
  return window;
}

const breakpoints = {
  'mobile': 767,
  'tablet': 1023,
  'smallDesktop': 1279,
  'largeDesktop': 1599
};

@Injectable()
export class PlatformService {
  userAgent = '';
  viewportWidth: number;
  viewportHeight: number;
  dimensions$: Observable<{ width: number, height: number }>;

  get nativeWindow(): any {
    return _window();
  }

  get deviceType(): string {
    const w = this.viewportWidth;
    if (w > breakpoints['tablet']) {
      return 'desktop';
    } else if (w > breakpoints['mobile']) {
      return 'tablet';
    }
    return 'mobile';
  }

  get isMobile(): boolean {
    return this.viewportWidth < breakpoints['mobile'];
  }

  get isTablet(): boolean {
    return this.viewportWidth > breakpoints['mobile'] &&
      this.viewportWidth <= breakpoints['tablet'];
  }

  get isSmallDesktop(): boolean {
    return this.viewportWidth > breakpoints['tablet'] &&
      this.viewportWidth <= breakpoints['smallDesktop'];
  }

  get isLargeDesktop(): boolean {
    return this.viewportWidth > breakpoints['smallDesktop'] &&
      this.viewportWidth <= breakpoints['largeDesktop'];
  }

  get isExtraLargeDesktop(): boolean {
    return this.viewportWidth > breakpoints['largeDesktop'];
  }

  get isLargerThanMobile(): boolean {
    return this.viewportWidth > breakpoints['mobile'];
  }

  get isLargerThanTablet(): boolean {
    return this.viewportWidth > breakpoints['tablet'];
  }

  get isLargerThanSmallDesktop(): boolean {
    return this.viewportWidth > breakpoints['smallDesktop'];
  }

  get isLargerThanLargeDesktop(): boolean {
    return this.viewportWidth > breakpoints['largeDesktop'];
  }

  /** Returns true if device is iOS */
  get isIos(): boolean {
    return this.userAgent.includes('iphone') || this.userAgent.includes('ipad');
  }

  /** Returns true if the device is iOS, running safari */
  get isIosSafari(): boolean {
    return this.isIos && (!this.userAgent.includes('crios') && !this.userAgent.includes('fxios'));
  }

  /** Returns if the device is android (but not firefox) */
  get isAndroid(): boolean {
    return this.userAgent.includes('android') &&
      !this.userAgent.includes('firefox');
  }

  /** Returns if the device has WebGL support */
  get hasWebGLSupport(): boolean {
    // Create canvas element. The canvas is not added to the
    // document itself, so it is never displayed in the
    // browser window.
    const canvas = this.nativeWindow.document.createElement('canvas');
    // Get WebGLRenderingContext from canvas element.
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return (gl && gl instanceof WebGLRenderingContext);
  }

  constructor() {
    this.userAgent = this.nativeWindow.navigator.userAgent.toLowerCase();
    // store viewport width / height
    this.updateDimensions({
      width: this.nativeWindow.innerWidth,
      height: this.nativeWindow.innerHeight
    });
    // provide observable for viewport dimensions
    this.dimensions$ = Observable.fromEvent(this.nativeWindow, 'resize')
      .throttleTime(100, undefined, { trailing: true, leading: true })
      .map(e => {
        return {
          width: this.nativeWindow.innerWidth,
          height: this.nativeWindow.innerHeight
        };
      });
    // update viewport width / height on resize
    this.dimensions$.subscribe(this.updateDimensions.bind(this));
  }

  /**
   * Expose URL encoding helper
   */
  urlEncode(content: string) {
    return this.nativeWindow.encodeURIComponent(content);
  }

  /**
   * Helper for getting the current URL that works in templates
   */
  currentUrl() {
    return this.nativeWindow.location.href;
  }

  isMapToolSupported() {

  }

  private updateDimensions(dim: { width: number, height: number }) {
    this.viewportHeight = dim.height;
    this.viewportWidth = dim.width;
  }

}
