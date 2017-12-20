import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RankingLocation } from '../ranking-location';

@Component({
  selector: 'app-ranking-panel',
  templateUrl: './ranking-panel.component.html',
  styleUrls: ['./ranking-panel.component.scss']
})
export class RankingPanelComponent implements OnInit {

  @Input() location: RankingLocation;
  @Output() goToPrevious: EventEmitter<RankingLocation>;
  @Output() goToNext: EventEmitter<RankingLocation>;

  constructor() { }

  ngOnInit() {
  }

}
