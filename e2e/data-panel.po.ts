import { browser, by, element } from 'protractor';
import { Search } from './search.po';

export class DataPanel {
  dataPanelElement() {
    return element(by.css('app-data-panel'));
  }

  panelCards() {
    return element(by.css('app-data-panel .panel-cards'));
  }

  viewMoreElement() {
    return element(by.css('.map-overlay button'));
  }

  clickViewMore() {
    this.viewMoreElement().click();
    browser.sleep(1000);
  }

  panelCardCloseButton(index = 1) {
    return element(by.css(`.panel-cards .card:nth-child(${index}) app-ui-close-button button`));
  }

  selectLocation(searchText = 'detr') {
    const search = new Search();
    search.searchLocation(searchText);
  }

  removeLocation(index = 1) {
    this.panelCardCloseButton(index).click();
    browser.sleep(1000);
  }
}
