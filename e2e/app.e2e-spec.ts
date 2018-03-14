import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

browser.waitForAngularEnabled(false);

describe('eviction-maps App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should have the map element', () => {
    expect(page.mapElement().isPresent()).toBeTruthy();
  });

  it('should have a search bar', () => {
    expect(page.searchHeaderElement().isPresent()).toBeTruthy();
  });

  it('should update the route', () => {
    browser.waitForAngular();
    browser.sleep(500);
    expect(page.fullPath()).toContain('states');
  });

  it('should update the current translation', () => {
    page.toggleSpanish();
    const select = element(by.css('.map-ui app-ui-select:nth-of-type(3) .dropdown-value'));
    expect(select.getText().then(v => v.toUpperCase())).toContain('ESTADOS');
    browser.waitForAngular();
    expect(page.fullPath()).toContain('lang=es');
  });
});
