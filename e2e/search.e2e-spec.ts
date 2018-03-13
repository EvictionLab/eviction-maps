import { AppPage } from './app.po';
import { Search } from './search.po';
import { browser } from 'protractor';

browser.waitForAngularEnabled(false);

describe('eviction-maps Search', () => {
  let page: AppPage;
  let search: Search;

  beforeEach(() => {
    page = new AppPage();
    search = new Search();
    page.navigateTo();
  });

  it('should display suggestions after text input', () => {
    const searchInput = search.getSearchInputElement();
    searchInput.sendKeys('detr');
    browser.wait(() => search.getTypeaheadContainer().isPresent(), 1100);
    expect(search.getTypeaheadContainer().isPresent()).toBeTruthy();
  });

  it('should add a location after selecting a result', () => {
    const searchInput = search.getSearchInputElement();
    searchInput.sendKeys('detr');
    browser.wait(() => search.getFirstResult().isPresent(), 2000);
    search.getFirstResult().click();
    browser.wait(() => search.getLocationCard().isPresent(), 3000);
    expect(search.getLocationCard().isPresent()).toBeTruthy();
  });
});
