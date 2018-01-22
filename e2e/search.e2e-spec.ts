import { AppPage } from './app.po';
import { Search } from './search.po';
import { browser } from 'protractor';

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
    browser.wait(search.getTypeaheadContainer().isPresent(), 1100);
  });
});
