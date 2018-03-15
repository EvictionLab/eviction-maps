import { AppPage } from './app.po';
import { Rankings } from './rankings.po';
import { browser, element, by, ExpectedConditions } from 'protractor';

browser.waitForAngularEnabled(false);

describe('eviction-maps Rankings', () => {
  let page: AppPage;
  let rankings: Rankings;

  beforeEach(() => {
    page = new AppPage();
    rankings = new Rankings();
    page.navigateTo('/#/evictions');
    browser.driver.manage().window().maximize();
    browser.wait(ExpectedConditions.presenceOf(rankings.rankingsListElement()), 10000);
  });

  it('should display the list but not the ranking?s panel on load', () => {
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

  it('should show a toast and not update when trying to search for a location without data', () => {
    page.scrollToPosition(100);
    rankings.searchRankings('springdale, ar', 1);
    browser.sleep(1000);
    expect(page.toastElement().isPresent()).toBeTruthy();
    expect(rankings.rankingsPanelContent().isPresent()).toBeFalsy();
  });

  it('should show a toast and not update when trying to select a location without data', () => {
    page.scrollToPosition(200);
    browser.sleep(500);
    rankings.updateFilter(rankings.regionFilterSelect(), 5);
    rankings.updateFilter(rankings.areaFilterSelect(), 2);
    browser.sleep(500);
    rankings.selectLocation(3);
    rankings.selectLocation(10);
    rankings.selectLocation(15);
    const locationText = rankings.rankingsPanelLocationName().getText();
    browser.sleep(1000);
    rankings.selectLocation(21);
    browser.sleep(500);
    expect(page.toastElement().isPresent()).toBeTruthy();
    expect(rankings.rankingsPanelLocationName().getText()).toBe(locationText);
  });

  it('should show a toast and not update when clicking next to a location without data', () => {
    page.scrollToPosition(200);
    browser.sleep(500);
    rankings.updateFilter(rankings.regionFilterSelect(), 5);
    rankings.updateFilter(rankings.areaFilterSelect(), 2);
    rankings.selectLocation(3);
    rankings.selectLocation(10);
    rankings.selectLocation(15);
    rankings.selectLocation(20);
    browser.sleep(1000);
    const locationText = rankings.rankingsPanelLocationName().getText();
    rankings.rankingsPanelNextButton().click();
    expect(page.toastElement().isPresent()).toBeTruthy();
    expect(rankings.rankingsPanelLocationName().getText()).toBe(locationText);
  });
});
