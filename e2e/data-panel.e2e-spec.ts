import { AppPage } from './app.po';
import { DataPanel } from './data-panel.po';
import { browser, element, by } from 'protractor';

browser.waitForAngularEnabled(false);

describe('eviction-maps DataPanel', () => {
  let page: AppPage;
  let dataPanel: DataPanel;

  beforeEach(() => {
    page = new AppPage();
    dataPanel = new DataPanel();
    page.navigateTo();
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
    expect(dataPanel.panelCards().isDisplayed()).toBeTruthy();
    browser.sleep(1000);
    dataPanel.clickViewMore();
    browser.sleep(1000);
    expect(browser.executeScript('return window.scrollY;').then(v => +v)).toBeGreaterThan(0);
  });

  it('should hide the data panel when all locations are removed', () => {
    dataPanel.selectLocation();
    expect(dataPanel.panelCards().isDisplayed()).toBeTruthy();
    dataPanel.clickViewMore();
    browser.sleep(2000);
    dataPanel.removeLocation();
    expect(dataPanel.panelCards().isDisplayed()).toBeFalsy();
  });
});
