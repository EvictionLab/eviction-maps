import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { RankingLocation } from '../ranking-location';
import { TranslatePipe } from '@ngx-translate/core';

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
  @Input() propertyMap = {
    'primary': 'name',
    'secondary': 'displayParentLocation'
  };
  @Output() locationSelected = new EventEmitter<number>();
  get isRate() { return this.dataProperty.value.indexOf('Rate') > -1; }

  constructor(public el: ElementRef, private translatePipe: TranslatePipe) {}

  /**
   * Get bar width for a given location, returning 0 if data is unavailable
   * @param location
   */
  barWidth(location: RankingLocation): string {
    const value = location[this.dataProperty.value];
    if (value < 0) { return '0%'; }
    return `${100 * (value / this.maxValue)}%`;
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
