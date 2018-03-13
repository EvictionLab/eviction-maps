import { browser, by, element } from 'protractor';

export class DataPanel {
  getDataPanelElement() {
    return element(by.css('app-data-panel'));
  }
}
