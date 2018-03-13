import { AppPage } from './app.po';
import { Map } from './map.po';
import { browser, element, by } from 'protractor';

browser.waitForAngularEnabled(false);

describe('eviction-maps Map', () => {
  let page: AppPage;
  let map: Map;

  beforeEach(() => {
    page = new AppPage();
    map = new Map();
    page.navigateTo();
  });

  it('should open a dropdown on click', () => {
    const dropdown = map.getSelectElement();
    dropdown.click();
    expect(element(by.css('ul.dropdown-menu')).isPresent()).toBeTruthy();
  });

  it('should display the slider on selecting a layer', () => {
    expect(map.getSliderElement().isPresent()).toBeFalsy();
    const dropdown = map.getSelectElement();
    dropdown.click();
    element(by.css('ul.dropdown-menu li:nth-child(3)')).click();
    expect(map.getSliderElement().isPresent()).toBeTruthy();
  });
});
