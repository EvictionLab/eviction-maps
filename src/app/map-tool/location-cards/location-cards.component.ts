import {
  Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener
} from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { MapDataAttribute } from '../../map-tool/data/map-data-attribute';
import { MapFeature } from '../../map-tool/map/map-feature';

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

  /**
   * Input for which cards to show, one card for each feature.  If the update
   * contains the same features, the features are updated instead of a new
   * value being assigned. This prevents the animation from being re-triggered.
   */
  private _features: MapFeature[] = [];
  @Input() set features(value: MapFeature[]) {
    const sameAmount = this._features.length === value.length;
    if (sameAmount) {
      const sameFeatures = this._features.reduce((acc, cur, i) => {
        return acc ? cur.properties.GEOID === value[i].properties.GEOID : false;
      }, true);
      if (sameFeatures) {
        // features are the same, update their properties in place
        for (let i = 0; i < value.length; i++) {
          this._features[i].properties = value[i].properties;
        }
      }
    } else {
      this._features = value;
    }
  }
  get features(): MapFeature[] { return this._features; }

  /**
   * Input for which year's data to display in the card. Adds a reference
   * to the data property with year (e.g. 'e-12') to each card property when set.
   */
  private _year: number;
  @Input() set year(value: number) {
    if (value && value !== this._year) {
      this._year = value;
      this.addYearAttrToProps();
    }
  }
  get year(): number { return this._year; }

  /**
   * Input for which data attributes to show in the card.  Assigns a lookup array
   * for any properties that need special formatting when set.
   */
  private _cardProps: MapDataAttribute[] = [];
  @Input() set cardProperties(value) {
    if (!value) { return; }
    this._cardProps = value;
    this.percentProps = value.filter(p => p.format === 'percent').map(p => p.id);
    this.dollarProps = value.filter(p => p.format === 'dollar').map(p => p.id);
    this.addYearAttrToProps();
  }
  get cardProperties(): MapDataAttribute[] { return this._cardProps; }

  /** Determines if the cards collapse when not being interacted with */
  @Input() collapsible = false;
  /** Determines if placeholder cards are added that allow adding a location */
  @Input() allowAddLocation = false;
  /** US Average data used to show how a location compares (eviction rate only) */
  @Input() usAverage: Object;
  @Output() dismissedCard = new EventEmitter();
  @Output() locationAdded = new EventEmitter();
  @Output() clickedHeader = new EventEmitter();
  @HostBinding('class.no-cards') get noCards() {
    return this.features.length === 0;
  }
  expanded = true;
  clickHeader = false;
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

  getAbbrYear() {
    if (!this.year) { return; }
    return this.year.toString().slice(-2);
  }


  /** gets an animation state for the card number */
  getCardState(cardNum: number) {
    return this.collapsible ?
      'card' + (this.expanded ? '-e-' : '-') + cardNum + '-' + this.features.length : 'card';
  }

  /** tracks card in the ngFor by the feature's GEOID */
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

  /** Add a reference to the current year property name for each data attribute */
  private addYearAttrToProps() {
    this._cardProps = this._cardProps.map(p => {
      p.yearAttr = p.id + '-' + this.getAbbrYear();
      return p;
    });
  }

}