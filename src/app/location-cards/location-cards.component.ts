import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-location-cards',
  templateUrl: './location-cards.component.html',
  styleUrls: ['./location-cards.component.scss']
})
export class LocationCardsComponent implements OnInit {
  @Input() allowAddLocation = false;
  @Input() features: Array<any>;
  @Input() year = 2010;
  @Input() cardProperties = {
    'er': 'Eviction Rate',
    'e': 'Evictions',
    'pr': 'Poverty Rate',
    'p': 'Population'
  };
  @Output() viewMore = new EventEmitter();
  @Output() dismissedCard = new EventEmitter();
  @Output() locationAdded = new EventEmitter();
  cardPropertyKeys: Array<string>;
  get abbrYear() { return this.year.toString().slice(-2); }

  constructor(public search: SearchService) { }

  ngOnInit() {
    this.cardPropertyKeys = Object.keys(this.cardProperties);
  }

}
