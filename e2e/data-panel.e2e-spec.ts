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
});
