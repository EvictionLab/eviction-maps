import { browser, by, element } from 'protractor';

export class Map {
  getMapElement() {
    return element(by.css('app-map'));
  }

  getSelectElement(index = 1) {
    return element(by.css(`app-map app-ui-select:nth-of-type(${index})`));
  }

  getSliderElement() {
    return element(by.css('app-map app-ui-slider'));
  }
}
