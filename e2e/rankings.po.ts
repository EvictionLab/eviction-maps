import { browser, by, element } from 'protractor';

export class Rankings {
  rankingsToolElement() {
    return element(by.css('app-rankings-tool'));
  }

  rankingsUIElement() {
    return element(by.css('app-ranking-ui'));
  }

  rankingsPanelElement() {
    return element(by.css('app-ranking-panel'));
  }

  rankingsListElement() {
    return element(by.css('ul.ranking-list'));
  }

  closePanelButton() {
    return element(by.css('app-ranking-panel .close-button'));
  }

  rankingsPanelContent() {
    return this.rankingsPanelElement().element(by.css('.content-inner'));
  }

  rankingsPanelLocationName() {
    return this.rankingsPanelContent().element(by.css('h2.rank-location'));
  }

  rankingsPanelNextButton() {
    return this.rankingsPanelContent().element(by.css('button.panel-next'));
  }

  searchInputElement() {
    return element(by.css('.ranking-ui-search input'));
  }

  typeaheadContainer() {
    return element(by.css('.ranking-ui-search typeahead-container'));
  }

  searchResult(index = 2) {
    return this.typeaheadContainer().element(by.css(`li:nth-of-type(${index})`));
  }

  regionFilterSelect() {
    return element(by.css('app-ui-select.region-select'));
  }

  areaFilterSelect() {
    return element(by.css('app-ui-select.area-select'));
  }

  rankSortSelect() {
    return element(by.css('app-ui-select.prop-select'));
  }

  rankingsTitleElement() {
    return element(by.css('.ranking-body h2'));
  }

  updateFilter(el, index = 1) {
    el.click();
    el.element(by.css(`.dropdown-menu li:nth-of-type(${index})`)).click();
  }

  searchRankings(searchText = 'detr', index = 2) {
    const searchInput = this.searchInputElement();
    searchInput.sendKeys(searchText);
    browser.wait(() => this.searchResult(index).isPresent(), 3000);
    this.searchResult(index).click();
  }

  selectLocation(index = 1) {
    const loc = element(by.css(`app-ranking-list li:nth-of-type(${index})`));
    loc.click();
    return loc;
  }
}
