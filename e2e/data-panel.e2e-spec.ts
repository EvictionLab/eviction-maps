import { AppPage } from './app.po';
import { DataPanel } from './data-panel.po';
import { browser, element, by, ExpectedConditions } from 'protractor';

browser.waitForAngularEnabled(false);

describe('eviction-maps DataPanel', () => {
  let page: AppPage;
  let dataPanel: DataPanel;

  beforeEach(() => {
    page = new AppPage();
    dataPanel = new DataPanel();
    page.navigateTo();
    browser.driver.manage().window().maximize();
  });

  it('should not display the data panel cards without locations', () => {
    expect(dataPanel.panelCards().isDisplayed()).toBeFalsy();
  });

  it('should display the data panel cards when a location is active', () => {
    dataPanel.selectLocation();
    expect(dataPanel.panelCards().isDisplayed()).toBeTruthy();
  });

  it('should scroll to the data panel after clicking view more', () => {
    dataPanel.selectLocation();
    browser.wait(ExpectedConditions.presenceOf(dataPanel.viewMoreElement()), 10000);
    dataPanel.clickViewMore();
    // Not sure why this is necessary, but otherwise it doesn't work
    dataPanel.removeLocation();
    expect(browser.executeScript('return document.documentElement.scrollTop;')
      .then(v => +v)).toBeGreaterThan(0);
  });

  it('should hide the data panel when all locations are removed', () => {
    dataPanel.selectLocation();
    browser.wait(ExpectedConditions.presenceOf(dataPanel.viewMoreElement()), 10000);
    dataPanel.clickViewMore();
    dataPanel.removeLocation();
    expect(dataPanel.panelCards().isDisplayed()).toBeFalsy();
  });
});
