import { AppPage } from './app.po';
import { Rankings } from './rankings.po';
import { browser, element, by } from 'protractor';

browser.waitForAngularEnabled(false);

describe('eviction-maps DataPanel', () => {
  let page: AppPage;
  let rankings: Rankings;

  beforeEach(() => {
    page = new AppPage();
    rankings = new Rankings();
    page.navigateTo();
  });
});
