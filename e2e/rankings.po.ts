import { browser, by, element } from 'protractor';

export class Rankings {
  getRankingsTool() {
    return element(by.css('app-rankings-tool'));
  }
}
