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
    return element(by.css('app-ranking-list'));
  }

  closePanelButton() {
    return element(by.css('app-ranking-panel .close-button'));
  }

  rankingsPanelContent() {
    return this.rankingsPanelElement().element(by.css('.content-inner'));
  }

  searchInputElement() {
    return element(by.css('.ranking-ui-search input'));
  }

  typeaheadContainer() {
    return element(by.css('.ranking-ui-search typeahead-container'));
  }

  searchResult(index = 2) {
    return this.typeaheadContainer().element(by.css(`li:nth-child(${index}`));
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
    el.element(by.css(`.dropdown-menu li:nth-child(${index})`)).click();
  }

  searchRankings(searchText = 'detr') {
    const searchInput = this.searchInputElement();
    searchInput.sendKeys(searchText);
    browser.wait(() => this.searchResult().isPresent(), 2000);
    this.searchResult().click();
  }

  selectLocation(index = 1) {
    const loc = element(by.css(`app-ranking-list li:nth-child(${index})`));
    loc.click();
    return loc;
  }
}
