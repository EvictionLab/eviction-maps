import {
  Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, ElementRef
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RankingLocation } from '../ranking-location';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ranking-panel',
  templateUrl: './ranking-panel.component.html',
  styleUrls: ['./ranking-panel.component.scss'],
  providers: [DecimalPipe]
})
export class RankingPanelComponent implements OnChanges {
  @Input() year: number;
  @Input() rank: number;
  @Input() topCount: number;
  @Input() location: RankingLocation;
  @Input() dataProperty: { name: string, value: string };
  @Output() goToPrevious = new EventEmitter();
  @Output() goToNext = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() locationClick = new EventEmitter<number>();
  mapLink: string;

  constructor(public el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('location' in changes) {
      let baseUrl = environment.siteNav.find(l => l.langKey === 'NAV.MAP').defaultUrl;
      if (!baseUrl.endsWith('/')) { baseUrl += '/'; }

      this.mapLink = `${baseUrl}#/${environment.rankingsYear}?geography=cities&type=er&locations=${
        this.location.geoId},${this.location.latLon[1]},${this.location.latLon[0]}`;
    }
  }

}
