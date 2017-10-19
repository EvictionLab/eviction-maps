import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-location-cards',
  templateUrl: './location-cards.component.html',
  styleUrls: ['./location-cards.component.scss']
})
export class LocationCardsComponent implements OnInit {

  @Input() features: Array<any>;
  @Input() year = 2010;
  @Output() viewMore = new EventEmitter();
  @Output() dismissedCard = new EventEmitter();
  cardProperties = [ 'evictions', 'eviction-rate', 'poverty-rate' ];
  propertyLabels = [ 'Evictions', 'Eviction Rate', 'Poverty Rate' ];

  constructor() { }

  ngOnInit() {
  }

}
