import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
    'efr': 'Eviction Filing Rate',
    'ef': 'Eviction Filings',
    'pr': 'Poverty Rate',
    'p': 'Population'
  };
  @Output() viewMore = new EventEmitter();
  @Output() dismissedCard = new EventEmitter();
  @Output() locationAdded = new EventEmitter();
  @Output() clickedHeader = new EventEmitter();
  @Input() clickHeader = false;
  cardPropertyKeys: Array<string>;
  get abbrYear() { return this.year.toString().slice(-2); }

  constructor() { }

  ngOnInit() {
    this.cardPropertyKeys = Object.keys(this.cardProperties);
  }

}
