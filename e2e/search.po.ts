import { browser, by, element } from 'protractor';

export class Search {
  searchInputElement() {
    return element(by.css('.header-search app-predictive-search input.form-control'));
  }

  typeaheadContainer() {
    return element(by.css('.header-search typeahead-container'));
  }

  firstResult() {
    return element(by.css('.header-search typeahead-container li.active'));
  }

  locationCard() {
    return element(by.css('.map-ui-wrapper app-location-cards .card'));
  }

  searchLocation(searchText = 'detr') {
    const searchInput = this.searchInputElement();
    searchInput.sendKeys(searchText);
    browser.wait(() => this.firstResult().isPresent(), 2000);
    this.firstResult().click();
    browser.sleep(1000);
  }
}
