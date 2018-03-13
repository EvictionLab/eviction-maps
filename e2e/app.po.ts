import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
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
}
