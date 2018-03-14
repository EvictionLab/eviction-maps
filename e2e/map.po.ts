import { browser, by, element } from 'protractor';

export class Map {
  mapElement() {
    return element(by.css('app-map'));
  }

  selectElement(index = 1) {
    return element(by.css(`app-map app-ui-select:nth-of-type(${index})`));
  }

  sliderElement() {
    return element(by.css('app-map app-ui-slider'));
  }
}
