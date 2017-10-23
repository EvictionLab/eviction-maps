import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-location-cards',
  templateUrl: './location-cards.component.html',
  styleUrls: ['./location-cards.component.scss']
})
export class LocationCardsComponent implements OnInit {

  @Input() features: Array<any>;
  @Input() year = 2010;
  @Input() cardProperties =
    {'e': 'Evictions', 'er': 'Eviction Rate', 'pr': 'Poverty Rate', 'p': 'Population' };
  @Output() viewMore = new EventEmitter();
  @Output() dismissedCard = new EventEmitter();
  cardPropertyKeys: Array<string>;
  get abbrYear() { return this.year.toString().slice(-2); }

  constructor() { }

  ngOnInit() {
    this.cardPropertyKeys = Object.keys(this.cardProperties);
  }

}
