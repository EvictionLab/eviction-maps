import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-location-cards',
  templateUrl: './location-cards.component.html',
  styleUrls: ['./location-cards.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0', transform: 'translateX(-100%)' }),
        animate('0.2s ease-out', style({ opacity: '1', transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('0.2s ease-out', style({ opacity: '0', transform: 'translateX(-100%)' })),
      ]),
    ])
  ],
})
export class LocationCardsComponent {
  @Input() allowAddLocation = false;
  @Input() features: Array<any>;
  @Input() year = 2010;
  @Input()
  set cardProperties(value) {
    this._cardProps = value;
    this.cardPropertyKeys = Object.keys(value);
  }
  get cardProperties() {
    return this._cardProps;
  }
  @Output() dismissedCard = new EventEmitter();
  @Output() locationAdded = new EventEmitter();
  @Output() clickedHeader = new EventEmitter();
  @HostBinding('class.expanded') expanded = false;
  clickHeader = false;
  cardPropertyKeys: Array<string>;
  get abbrYear() { return this.year.toString().slice(-2); }
  private _cardProps;
  constructor() { }

}
