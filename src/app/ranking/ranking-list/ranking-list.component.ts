import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RankingLocation } from '../ranking-location';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss']
})
export class RankingListComponent implements OnInit {

  @Input() list: Array<RankingLocation>;
  @Input() dataProperty: string;
  @Input() maxValue: number;
  @Input() selectedIndex: number;
  @Output() locationSelected = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {
  }

}
