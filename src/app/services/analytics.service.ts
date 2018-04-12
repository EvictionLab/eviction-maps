import { Injectable } from '@angular/core';
import { PlatformService } from './platform.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AnalyticsService {
  dataLayer;
  private _debug = true;

  constructor(
    private platform: PlatformService
  ) {
    // grab global dataLayer from window
    this.dataLayer = platform.nativeWindow.dataLayer;
  }

  /**
   * Pushes the event to the global dataLayer array that
   * Google Tag Manager is watching.
   * @param id string of the event name
   * @param data object of event data
   */
  trackEvent(id: string, data: any = {}) {
    // do not track unless in production
    if (!environment.production) {
      this.debug(`tracking ${id}`, data);
      return;
    }
    if (!this.dataLayer) { throw Error('dataLayer does not exist'); }
    const event = { event: id, ...data };
    this.dataLayer.push(event);
  }


  private debug(...args) {
    // tslint:disable-next-line
    environment.production || !this._debug ?  null : console.debug.apply(console, [ 'analytics: ', ...args]);
  }

}
