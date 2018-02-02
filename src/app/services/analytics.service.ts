import { Injectable } from '@angular/core';
import { PlatformService } from './platform.service';


@Injectable()
export class AnalyticsService {
  dataLayer;

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
  trackEvent(id: string, data: any) {
    if (!this.dataLayer) { throw Error('dataLayer does not exist'); }
    const event = { event: id, ...data };
    this.dataLayer.push(event);
  }

}
