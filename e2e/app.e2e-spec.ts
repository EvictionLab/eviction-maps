import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('eviction-maps App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should have the map element', () => {
    expect(page.getMapElement().isPresent()).toBeTruthy();
  });

  it('should have a search bar', () => {
    expect(page.getSearchHeaderElement().isPresent()).toBeTruthy();
  });

  it('should update the route', () => {
    expect(page.getFullPath()).toContain('states');
  });
});
