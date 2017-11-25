import { browser, by, element } from 'protractor';

export class Search {
  getSearchInputElement() {
    return element(by.css('.header-search app-predictive-search input.form-control'));
  }

  getTypeaheadContainer() {
    return element(by.css('.header-search typeahead-container'));
  }
}
