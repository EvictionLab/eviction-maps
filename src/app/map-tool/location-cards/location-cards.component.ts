import {
  Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener, ViewChildren,
  QueryList, Inject, ElementRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DOCUMENT } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { MapDataAttribute } from '../../map-tool/data/map-data-attribute';
import { MapFeature } from '../../map-tool/map/map-feature';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-location-cards',
  templateUrl: './location-cards.component.html',
  styleUrls: ['./location-cards.component.scss'],
  providers: [ DecimalPipe ],
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
      transition('void => card', []),
      transition('card => void', []),
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
  @Input()
  set collapsed(isCollapsed: boolean) {
    if (!this.collapsible) { return; }
    if (!isCollapsed !== this.expanded) {
      this.expanded = !isCollapsed;
      this.collapsedChange.emit(isCollapsed);
    }
  }
  get collapsed(): boolean { return !this.expanded; }
  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter();
  @Output() dismissedCard = new EventEmitter();
  @Output() locationAdded = new EventEmitter();
  @Output() clickedHeader = new EventEmitter();
  @HostBinding('class.no-cards') get noCards() {
    return this.features.length === 0;
  }
  /** Used for hiding all tooltips on touchstart */
  @ViewChildren(TooltipDirective) tooltips: QueryList<TooltipDirective>;
  /** determines if cards are expanded (map view) */
  private expanded = true;
  /** Maximum number of characters for location name */
  maxLocationLength = 24;
  /** Stores which properties should be % formatted */
  private percentProps;
  /** Stores which properties should be $ formatted */
  private dollarProps;

  constructor(
    public el: ElementRef,
    private decimal: DecimalPipe,
    private platform: PlatformService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.collapsed = this.collapsible;
  }

  /** Expand cards on mouse enter */
  @HostListener('mouseenter', ['$event']) onmouseenter(e) {
    this.collapsed = false;
  }

  /** Collapse cards on mouse leave, if enabled */
  @HostListener('mouseleave', ['$event']) onmouseleave(e) {
    this.collapsed = this.collapsible;
  }

  removeCard(e, feature) {
    this.dismissedCard.emit(feature);
    this.setFocusElement(e);
  }

  /** Checks if the property name exists in the feature's high flagged properties */
  isHighProp(feature, prop: string) {
    if (!feature['highProps']) { return false; }
    return feature['highProps'].indexOf(prop) > -1;
  }

  /** Checks if the property name exists in the feature's low flagged properties */
  isLowProp(feature, prop: string) {
    if (!feature['lowProps']) { return false; }
    return feature['lowProps'].indexOf(prop) > -1;
  }

  /** Special case to check for the Maryland eviction filing rate */
  isMarylandFiling(feature, prop: string) {
    return feature.properties['GEOID'] === '24' && prop === 'efr';
  }

  getAbbrYear() {
    if (!this.year) { return; }
    return this.year.toString().slice(-2);
  }

  /** Get location name and truncate if it's too long */
  getLocationName(name: string) {
    const max = this.maxLocationLength;
    return name.length > max ? name.substring(0, max) + '...' : name;
  }


  /** gets an animation state for the card number */
  getCardState(cardNum: number) {
    return this.collapsible ?
      'card' + (this.expanded ? '-e-' : '-') + cardNum + '-' + this.features.length : 'card';
  }

  getAverageOffsetPrefix(locationValue, averageValue) {
    const difference = Math.abs(locationValue - averageValue);
    return difference < 0.001 ? '=' :
      (locationValue > averageValue ? '+' : '-');
  }

  getAverageOffset(locationValue, averageValue) {
    const difference = Math.abs(locationValue - averageValue);
    return this.getAverageOffsetPrefix(locationValue, averageValue)
      + this.decimal.transform(difference, '1.1-2');
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

  /** Handle capping rate values at >100 */
  processValue(feat: MapFeature, prop: MapDataAttribute) {
    if (prop.type === 'bubble' && feat.properties[prop.yearAttr] > 100) {
      return '>100';
    }
    return this.decimal.transform(feat.properties[prop.yearAttr], '1.0-2');
  }

  /**
   * Sets the tooltip position based on the card and property index, screen size,
   * and the number of properties for the location cards.
   * @param cardIdx
   * @param propIdx
   */
  tooltipPos(cardIdx: number, propIdx: number): string {
    if (this.platform.isLargerThanTablet) {
      return 'right';
    }
    // If there are fewer than 4 props, it's the map cards
    if (this._cardProps.length < 4) {
      // The last displayed property should have position top
      return propIdx < this._cardProps.length - 1 ? 'right' : 'top';
    }
    // If it's the data panel, return top for all items on the 3rd card
    return cardIdx < 2 ? 'right' : 'top';
  }

  /**
   * Hide all tooltips on touchstart
   * @param event
   */
  onTooltipShown(event: any) {
    Observable.fromEvent(this.document, 'touchstart')
      .take(1)
      .subscribe(e => this.tooltips.forEach(t => t.hide()));
  }

  /** Sets focus to the appropriate element in the cards */
  private setFocusElement(e) {
    if (this.allowAddLocation) {
      // focus input to add another location if it exists
      const focusInput = this.el.nativeElement.getElementsByTagName('input');
      if (focusInput.length) { focusInput[0].focus(); }
      return;
    }
    // focus button element if no input
    // card 3 closed focus card 2, card 2 closed focus card 1, card 1 closed focus card 2
    const focusButtons = this.el.nativeElement.getElementsByClassName('btn-icon');
    let focusButton;
    let next = false;
    for (let i = focusButtons.length - 1; i > -1; i--) {
      if (focusButtons[i] !== e.target) {
        focusButton = focusButtons[i];
        if (next) { break; }
      } else {
        next = true; // flag to use the next element in the loop
      }
    }
    if (focusButton) { focusButton.focus(); }
  }

  /** Add a reference to the current year property name for each data attribute */
  private addYearAttrToProps() {
    this._cardProps = this._cardProps.map(p => {
      p.yearAttr = p.id + '-' + this.getAbbrYear();
      return p;
    });
  }

}
