import { AppPage } from './app.po';
import { Map } from './map.po';
import { browser } from 'protractor';

describe('eviction-maps Search', () => {
  let page: AppPage;
  let map: Map;

  beforeEach(() => {
    page = new AppPage();
    map = new Map();
    page.navigateTo();
  });
});
