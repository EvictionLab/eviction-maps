import { AppPage } from './app.po';

describe('eviction-maps App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should have the map element', () => {
    page.navigateTo();
    expect(page.getMapElement().isPresent()).toBeTruthy();
  });
});
