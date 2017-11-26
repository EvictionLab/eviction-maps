import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    browser.get('/');
    return browser.refresh();
  }

  getMapElement() {
    return element(by.css('app-root app-mapbox'));
  }

  getSearchHeaderElement() {
    return element(by.css('.header-search app-predictive-search'));
  }

  getFullPath() {
    return browser.getCurrentUrl();
  }
}
