import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RankingLocation } from '../ranking-location';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss']
})
export class RankingListComponent {
  @Input() list: Array<RankingLocation>;
  @Input() dataProperty: string;
  @Input() maxValue: number;
  @Input() selectedIndex: number;
  @Input() propertyMap = {
    'primary': 'name',
    'secondary': 'displayParentLocation'
  };
  @Output() locationSelected = new EventEmitter<number>();
}
