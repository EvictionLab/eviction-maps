import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectorRef
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { DownloadFormComponent } from './download-form/download-form.component';
import { UiDialogService } from '../../ui/ui-dialog/ui-dialog.service';
import { MapFeature } from '../map/map-feature';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { PlatformService } from '../../services/platform.service';
import { PlatformLocation } from '@angular/common';
import { MapToolService } from '../map-tool.service';
import { MapDataAttribute } from '../data/map-data-attribute';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
  providers: [ TranslatePipe ]
})
export class DataPanelComponent implements OnInit {

  /** Year input and output (allows double binding) */
  private _year: number;
  @Input() set year(newYear: number) {
    if (newYear !== this._year) {
      this.yearChange.emit(newYear);
    }
    this._year = newYear;
  }
  get year() { return this._year; }
  @Output() yearChange = new EventEmitter();

  /** Location Attributes */
  displayLocations: MapFeature[] = []; // Locations to use for location cards, download
  @Input() set locations(locations: MapFeature[]) {
    this.displayLocations = locations;
    this.updateTwitterText();
  }
  get locations() { return this.displayLocations; }
  @Output() locationRemoved = new EventEmitter();
  @Output() locationAdded = new EventEmitter();

  /** Data attributes for location cards and graph */
  private _dataAttributes = [];
  @Input() set dataAttributes(attr: MapDataAttribute[]) {
    this._dataAttributes = attr;
    this.updateCardAttributes();
    this.updateGraphAttributes();
  }
  get dataAttributes() { return this._dataAttributes; }
  graphAttributes: MapDataAttribute[] = [];
  cardAttributes: MapDataAttribute[] = [];

  // Used to inform map tool when graph type changes
  @Output() graphTypeChange = new EventEmitter();


  tweetTranslation = 'DATA.TWEET_ONE_FEATURE';
  tweetParams = {};

  constructor(
    public dialogService: UiDialogService,
    public mapToolService: MapToolService,
    private translatePipe: TranslatePipe,
    private translate: TranslateService,
    private platform: PlatformService,
    private analytics: AnalyticsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.updateTwitterText();
    });
    // Needed to prevent ExpressionChangedAfterItHasBeenCheckedError
    this.cd.detectChanges();
  }

  /** Builds the array of card attributes from the array of data attributes */
  updateCardAttributes() {
    const dividerIndex = 11; // index where the divider is inserted
    const divider = { id: 'divider', langKey: 'STATS.DEMOGRAPHICS' };
    // put the props in the correct order
    const cardProps = this._dataAttributes
      .filter(d => typeof d.order === 'number')
      .sort((a, b) => a.order > b.order ? 1 : -1);
    // add the divider
    this.cardAttributes = [
      ...cardProps.slice(0, dividerIndex), divider, ...cardProps.slice(dividerIndex)
    ];
  }

  /** Builds the array of attributes available for the graph */
  updateGraphAttributes() {
    // only graphing the bubble attributes
    this.graphAttributes = this.dataAttributes
      .filter(d => d.type === 'bubble' && d.id !== 'none');
  }

  showDownloadDialog(e) {
    const config = {
      lang: this.translate.currentLang,
      year: this.year,
      startYear: this.mapToolService.activeLineYearStart,
      endYear: this.mapToolService.activeLineYearEnd,
      features: this.displayLocations,
      dataProp: this.mapToolService.activeDataHighlight.id,
      bubbleProp: this.mapToolService.activeBubbleHighlight.id,
      showUsAverage: this.mapToolService.activeShowGraphAvg,
      usAverage: this.mapToolService.usAverage
    };
    this.dialogService.showDownloadDialog(DownloadFormComponent, config)
      .subscribe((d) => this.trackDownload(d));
  }

  /**
   * Tracks the download event with locations, year ranges, and file types
   * @param fileTypes a string of filetypes selected in the export dialog
   */
  trackDownload(fileTypes: string) {
    const yearString = this.year + ',' +
      this.mapToolService.activeLineYearStart + '-' +
      this.mapToolService.activeLineYearEnd;
    const comparisonDownloadType = [
      this.mapToolService.getActiveLocationNames(), yearString, fileTypes
    ].join('|');
    this.analytics.trackEvent('comparisonDataDownload', { comparisonDownloadType });
  }

  /**
   * Tracks when the map is shared from the data panel footer
   */
  trackShare(mapShareType: string) {
    this.analytics.trackEvent('mapShare', { mapShareType });
  }

  /**
   * Update Twitter share text
   */
  updateTwitterText() {
    const features = this.locations;
    const featLength = this.locations.length;
    this.tweetParams = { year: this.year, link: this.getCurrentUrl() };

    if (featLength === 1) {
      this.tweetTranslation = 'DATA.TWEET_ONE_FEATURE';
      this.tweetParams = { ...this.tweetParams, place1: features[0].properties.n };
    } else if (featLength === 2) {
      this.tweetTranslation = 'DATA.TWEET_TWO_FEATURES';
      this.tweetParams = {
        ...this.tweetParams, place1: features[0].properties.n, place2: features[1].properties.n
      };
    } else if (featLength === 3) {
      this.tweetTranslation = 'DATA.TWEET_THREE_FEATURES';
      this.tweetParams = {
        ...this.tweetParams,
        place1: features[0].properties.n,
        place2: features[1].properties.n,
        place3: features[2].properties.n
      };
    }
  }

  /**
   * Encoding URL for Facebook share
   */
  getEncodedUrl() {
    return this.platform.nativeWindow.encodeURIComponent(this.getCurrentUrl());
  }

  /**
   * Adding method because calling window directly in the template doesn't work
   */
  getCurrentUrl() {
    return this.platform.nativeWindow.location.href;
  }

  /**
   * Display dialog with error message if mailto link doesn't open after 1 second
   * @param e
   */
  checkMailto(e) {
    // Cancel if on mobile, since behavior isn't the same
    if (this.platform.isMobile) {
      return;
    }
    // https://www.uncinc.nl/articles/dealing-with-mailto-links-if-no-mail-client-is-available
    let timeout;

    this.platform.nativeWindow.addEventListener('blur', () => clearTimeout(timeout));
    timeout = setTimeout(() => {
      this.dialogService.showDialog({
        title: 'Email Link Error',
        content: [
          {
            type: 'text',
            data: 'Please set a default mail client in your browser to use the email link.'
          }
        ]
      });
    }, 1000);
  }
}
