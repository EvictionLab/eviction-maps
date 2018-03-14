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
    const searchInput = search.searchInputElement();
    searchInput.sendKeys('detr');
    browser.wait(() => search.typeaheadContainer().isPresent(), 1100);
    expect(search.typeaheadContainer().isPresent()).toBeTruthy();
  });

  it('should add a location after selecting a result', () => {
    search.searchLocation();
    expect(search.locationCard().isPresent()).toBeTruthy();
  });

  it('should display a toast message if a location is not found', () => {
    search.searchLocation('long island');
    expect(search.toastElement().isPresent()).toBeTruthy();
  });

  it('should display a toast message if 3 locations are already selected', () => {
    search.searchLocation();
    search.searchLocation('north dakota');
    search.searchLocation('florida');
    search.searchLocation('minnesota');
    browser.sleep(1000);
    expect(search.toastElement().isPresent()).toBeTruthy();
  });
});
