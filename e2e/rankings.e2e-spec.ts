import { AppPage } from './app.po';
import { Rankings } from './rankings.po';
import { browser, element, by } from 'protractor';

browser.waitForAngularEnabled(false);

describe('eviction-maps Rankings', () => {
  let page: AppPage;
  let rankings: Rankings;

  beforeEach(() => {
    page = new AppPage();
    rankings = new Rankings();
    page.navigateTo('/#/evictions');
    browser.sleep(2000);
  });

  it('should display the list but not the rankings panel on load', () => {
    expect(rankings.rankingsListElement().isPresent()).toBeTruthy();
    expect(rankings.rankingsPanelContent().isPresent()).toBeFalsy();
  });

  it('should display the rankings panel on selecting a location', () => {
    rankings.selectLocation();
    expect(rankings.rankingsPanelContent().isPresent()).toBeTruthy();
  });

  it('should give focus to the close button on initially selecting a location', () => {
    rankings.selectLocation();
    browser.sleep(1000);
    expect(rankings.closePanelButton().getAttribute('outerHTML'))
      .toBe(browser.driver.switchTo().activeElement().getAttribute('outerHTML'));
  });

  it('should update the title when the filters are changed', () => {
    const titleText = rankings.rankingsListElement().getAttribute('innerHTML');
    rankings.updateFilter(rankings.regionFilterSelect(), 3);
    expect(rankings.rankingsTitleElement().getAttribute('innerHTML')).not.toBe(titleText);
  });

  it('should display suggestions after search text input', () => {
    const searchInput = rankings.searchInputElement();
    searchInput.sendKeys('detr');
    browser.wait(() => rankings.typeaheadContainer().isPresent(), 1100);
    expect(rankings.typeaheadContainer().isPresent()).toBeTruthy();
  });

  it('should display the ranking panel on search select', () => {
    rankings.searchRankings();
    expect(rankings.rankingsPanelContent().isPresent()).toBeTruthy();
  });
});
