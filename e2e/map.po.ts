import { browser, by, element } from 'protractor';

export class Map {
  getMapElement() {
    return element(by.css('app-map'));
  }
}
