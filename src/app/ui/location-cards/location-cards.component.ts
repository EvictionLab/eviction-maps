import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-location-cards',
  templateUrl: './location-cards.component.html',
  styleUrls: ['./location-cards.component.scss'],
  animations: [
    trigger('cards', [
      state('card-1-1', style({ transform: 'translate3d(0%,0,0)' })),
      state('card-1-2', style({ transform: 'translate3d(7%,0,0)' })),
      state('card-1-3', style({ transform: 'translate3d(15%,0,0)' })),
      state('card-e-1-1', style({ transform: 'translate3d(0%,0,0)' })),
      state('card-e-1-2', style({ transform: 'translate3d(0%,0,0)' })),
      state('card-e-1-3', style({ transform: 'translate3d(0%,0,0)' })),
      state('card-2-2', style({ transform: 'translate3d(0%,0,0)' })),
      state('card-2-3', style({ transform: 'translate3d(7%,0,0)' })),
      state('card-e-2-2', style({ transform: 'translate3d(100%,0,0)' })),
      state('card-e-2-3', style({ transform: 'translate3d(100%,0,0)' })),
      state('card-3-3', style({ transform: 'translate3d(0%,0,0)' })),
      state('card-e-3-3', style({ transform: 'translate3d(200%,0,0)' })),
      transition('void => card-3-3', [
        style({ opacity: '0', transform: 'translate3d(-100%,0,0)' }),
        animate('0.4s 0.2s ease-in', style({ opacity: '1', transform: 'translate3d(0%, 0%, 0)' }))
      ]),
      transition('card-1-3 => void', [
        animate('1s ease-out', style({ opacity: '0', transform: 'translate3d(100%, 0%, 0)' }))
      ]),
      transition('card-e-3-3 => void', [
        animate('0.4s ease-out', style({ opacity: '0', transform: 'translate3d(200%, 50%, 0)' }))
      ]),
      transition('card-e-2-3 => void', [
        animate('0.4s ease-out', style({ opacity: '0', transform: 'translate3d(100%, 50%, 0)' }))
      ]),
      transition('card-e-2-2 => void', [
        animate('0.4s ease-out', style({ opacity: '0', transform: 'translate3d(100%, 50%, 0)' }))
      ]),
      transition(':enter', [
        style({ opacity: '0', transform: 'translate3d(-100%,0,0)' }),
        animate('0.2s ease-in', style({ opacity: '1', transform: 'translate3d(0,0,0)' }))
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('0.4s ease-out', style({ opacity: '0', transform: 'translate3d(0,50%,0)' })),
      ])
    ])
  ],
})
export class LocationCardsComponent {
  @Input() allowAddLocation = false;
  @Input() features: Array<any>;
  @Input() year = 2010;
  @Input() percentProps: Array<string>;
  @Input() dollarProps: Array<string>;
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
  expanded = false;
  clickHeader = false;
  cardPropertyKeys: Array<string>;
  get abbrYear() { return this.year.toString().slice(-2); }
  private _cardProps;
  private collapseTimeout = null;

  @HostListener('mouseenter', ['$event']) onmouseenter(e) {
    this.expandCards();
  }

  @HostListener('mouseleave', ['$event']) onmouseleave(e) {
    this.collapseCards();
  }

  /**
   * Return $ or other prefix if in property list
   * @param prop
   */
  prefix(prop: string) {
    return (this.dollarProps.indexOf(prop) !== -1) ? '$' : null;
  }

  /**
   * Return % or other suffix if in property list
   * @param prop
   */
  suffix(prop: string) {
    return (this.percentProps.indexOf(prop) !== -1) ? '%' : null;
  }

  expandCards() {

    this.expanded = true;
  }

  collapseCards() {
    this.expanded = false;
  }

}
