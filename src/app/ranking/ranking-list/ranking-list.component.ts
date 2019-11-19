import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { RankingLocation } from '../ranking-location';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

const roundValue = (value) => {
  return Math.round(value * 100) / 100;
}

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss']
})
export class RankingListComponent {
  @Input() list: Array<RankingLocation>;
  @Input() dataProperty: { value: string, name: string };
  @Input() maxValue: number;
  @Input() selectedIndex: number;
  @Input() year = 2016;
  @Input() propertyMap = {
    'primary': 'name',
    'secondary': 'displayParentLocation'
  };
  @Output() locationSelected = new EventEmitter<number>();

  get isRate() { return this.dataProperty.value.indexOf('Rate') > -1; }

  constructor(public el: ElementRef, private translatePipe: TranslatePipe) {}

  /**
   * Return an approximate bounding box string for a given center point
   * @param latLon
   */
  private centerBounds(latLon: number[]): string {
    const lon = latLon[1];
    const lat = latLon[0];
    const lonPad = 0.5;
    const latPad = 0.25;
    return `${lon - lonPad},${lat - latPad},${lon + lonPad},${lat + latPad}`;
  }

  getMapLinkForLocation(location: RankingLocation): string {
    let baseUrl = environment.siteNav.find(l => l.langKey === 'NAV.MAP').defaultUrl;
    if (!baseUrl.endsWith('/')) { baseUrl += '/'; }

    return `${baseUrl}#/${environment.rankingsYear}?geography=cities&type=er&bounds=${
      this.centerBounds(location.latLon)}&locations=${location.geoId},${
      location.latLon[1]},${location.latLon[0]}`;
  }

  /**
   * Get bar width for a given location, returning 0 if data is unavailable
   * @param location
   */
  barWidth(location: RankingLocation, type: string): string {
    const value = location[this.dataProperty.value];
    if (value < 0) { return '0%'; }
    switch (type) {
      case 'low':
        return `${100 * ((value * 0.9) / this.maxValue)}%`;
      case 'high':
        return `${100 * ((value * 1.1) / this.maxValue)}%`;
      default:
        return `${100 * (value / this.maxValue)}%`;
    }
  }

  /** Return true if label should appear on bar */
  showValueOnBar(location: RankingLocation): boolean {
    const value = location[this.dataProperty.value];
    return value && ((value / this.maxValue) > 0.5);
  }

  getValueForLocation(location: RankingLocation, type: string): string {
    let value = 
      location[this.dataProperty.value] > 100 && this.isRate ?
        '>100%' : location[this.dataProperty.value];
    if (type === 'low') { value = roundValue(value * 0.9); }
    if (type === 'high') { value = roundValue(value * 1.1); }
    return this.isRate ? `${value}%` : value;
  }

  /**
   * Gets a readable string for the provided list item
   * @param rank
   * @param listItem
   */
  getAriaLabel(rank, listItem) {
    if (this.propertyMap.primary === 'name') {
      // location ranking
      return this.translatePipe.transform('RANKINGS.LOCATION_DESCRIPTION', {
        rank: listItem[this.dataProperty.value] >= 0 ?
          rank : this.translatePipe.transform('RANKINGS.NA_RANK'),
        location: listItem[this.propertyMap['primary']] + ', '
                + listItem[this.propertyMap['secondary']],
        dataType: this.dataProperty.name,
        value: listItem[this.dataProperty.value] >= 0 ?
          listItem[this.dataProperty.value] + (this.isRate ? '%' : '') :
          this.translatePipe.transform('DATA.UNAVAILABLE')
      });
    }
  }
}
