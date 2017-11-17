import { Injectable } from '@angular/core';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class PlatformService {

  get nativeWindow(): any {
    return _window();
  }

  get isMobile(): boolean {
    return this.nativeWindow.innerWidth < 767;
  }

  get isTablet(): boolean {
    return this.nativeWindow.innerWidth > 767 &&
      this.nativeWindow.innerWidth <= 1024;
  }

  constructor() { }

}
