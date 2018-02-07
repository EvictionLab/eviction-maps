import { Injectable } from '@angular/core';

function _window(): any {
  // return the global native browser window object
  return window;
}

const breakpoints = {
  'mobile': 767,
  'tablet': 1024,
  'smallDesktop': 1279,
  'largeDesktop': 1599
};

@Injectable()
export class PlatformService {

  get nativeWindow(): any {
    return _window();
  }

  get deviceWidth(): any {
    return this.nativeWindow.innerWidth;
  }

  get deviceType(): string {
    const w = this.deviceWidth;
    if (w > breakpoints['tablet']) {
      return 'desktop';
    } else if (w > breakpoints['mobile']) {
      return 'tablet';
    }
    return 'mobile';
  }

  get isMobile(): boolean {
    return this.deviceWidth < breakpoints['mobile'];
  }

  get isTablet(): boolean {
    return this.deviceWidth > breakpoints['mobile'] &&
      this.deviceWidth <= breakpoints['tablet'];
  }

  get isSmallDesktop(): boolean {
    return this.deviceWidth > breakpoints['tablet'] &&
      this.deviceWidth <= breakpoints['smallDesktop'];
  }

  get isLargeDesktop(): boolean {
    return this.deviceWidth > breakpoints['smallDesktop'] &&
      this.deviceWidth <= breakpoints['largeDesktop'];
  }

  get isExtraLargeDesktop(): boolean {
    return this.deviceWidth > breakpoints['largeDesktop'];
  }

  get isLargerThanMobile(): boolean {
    return this.deviceWidth > breakpoints['mobile'];
  }

  get isLargerThanTablet(): boolean {
    return this.deviceWidth > breakpoints['tablet'];
  }

  get isLargerThanSmallDesktop(): boolean {
    return this.deviceWidth > breakpoints['smallDesktop'];
  }

  get isLargerThanLargeDesktop(): boolean {
    return this.deviceWidth > breakpoints['largeDesktop'];
  }

}
