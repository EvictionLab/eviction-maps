import {
  Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener
} from '@angular/core';
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
export class LocationCardsComponent implements OnInit {
  @Input() allowAddLocation = false;
  @Input() usAverage: Object;

  /**  */
  private _features = [];
  @Input() set features(value: Array<any>) {
    const sameAmount = this._features.length === value.length;
    if (sameAmount) {
      const sameFeatures = this._features.reduce((acc, cur, i) => {
        return acc ? cur.properties.GEOID === value[i].properties.GEOID : false;
      }, true);
      if (sameFeatures) {
        // update props if they're the same
      }
    } else {
      this._features = value;
    }
  }
  get features() { return this._features; }

  /** Year for card */
  private _year;
  @Input() set year(value: number) {
    if (value && value !== this._year) {
      this._year = value;
      this.addYearAttrToProps();
    }
  }
  get year(): number { return this._year; }

  /** Card properties */
  private _cardProps = [];
  @Input()
  set cardProperties(value) {
    if (!value) { return; }
    this._cardProps = value;
    this.percentProps = value.filter(p => p.format === 'percent').map(p => p.id);
    this.dollarProps = value.filter(p => p.format === 'dollar').map(p => p.id);
    this.addYearAttrToProps();
  }
  get cardProperties() {
    return this._cardProps;
  }
  @Input() collapsible = false;
  @Output() dismissedCard = new EventEmitter();
  @Output() locationAdded = new EventEmitter();
  @Output() clickedHeader = new EventEmitter();
  @HostBinding('class.no-cards') get noCards() {
    return this.features.length === 0;
  }
  expanded = true;
  clickHeader = false;
  cardPropertyKeys: Array<string>;
  get abbrYear() { return this.year.toString().slice(-2); }
  private percentProps;
  private dollarProps;

  ngOnInit() {
    if (this.collapsible) { this.expanded = false; }
  }

  /** Expand cards on mouse enter */
  @HostListener('mouseenter', ['$event']) onmouseenter(e) {
    this.expanded = true;
  }

  /** Collapse cards on mouse leave, if enabled */
  @HostListener('mouseleave', ['$event']) onmouseleave(e) {
    this.expanded = this.collapsible ? false : true;
  }

  getCardState(cardNum: number) {
    return this.collapsible ?
      'card' + (this.expanded ? '-e-' : '-') + cardNum + '-' + this.features.length : 'card';
  }

  trackCards(index, feature) {
    return feature.properties.GEOID;
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

  private addYearAttrToProps() {
    this._cardProps = this._cardProps.map(p => {
      p.yearAttr = p.id + '-' + this.abbrYear;
      return p;
    });
  }

}
