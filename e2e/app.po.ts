import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(path = '/') {
    return browser.get(path);
  }

  mapElement() {
    return element(by.css('app-root app-mapbox'));
  }

  searchHeaderElement() {
    return element(by.css('.header-search app-predictive-search'));
  }

  fullPath() {
    return browser.getCurrentUrl();
  }

  toastElement() {
    return element(by.css('#toast-container .toast'));
  }

  updateLanguage(langIdx: number) {
    element(by.css('.language-select')).click();
    element(by.css(`.language-select li:nth-child(${langIdx})`)).click();
  }

  toggleEnglish() {
    this.updateLanguage(1);
  }

  toggleSpanish() {
    this.updateLanguage(2);
  }

  scrollToPosition(top = 0) {
    return browser.executeScript(`window.scrollTo(0,${top});`);
  }
}
