import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectorRef
} from '@angular/core';
import Debounce from 'debounce-decorator';
import { environment } from '../../../environments/environment';
import { DownloadFormComponent } from './download-form/download-form.component';
import { UiDialogService } from '../../ui/ui-dialog/ui-dialog.service';
import { MapFeature } from '../map/map-feature';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { PlatformService } from '../../services/platform.service';
import { PlatformLocation, DecimalPipe } from '@angular/common';
import { MapToolService } from '../map-tool.service';
import { MapDataAttribute } from '../data/map-data-attribute';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
  providers: [ TranslatePipe, DecimalPipe ]
})
export class DataPanelComponent implements OnInit {

  /** Year input and output (allows double binding) */
  private _year = 2016;
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
  @Input() dataAttributes: MapDataAttribute[] = [];

  // Used to inform map tool when graph type changes
  @Output() graphTypeChange = new EventEmitter();

  embedUrl: string;
  tweet: string;

  constructor(
    public dialogService: UiDialogService,
    public mapToolService: MapToolService,
    public platform: PlatformService,
    private decimal: DecimalPipe,
    private translatePipe: TranslatePipe,
    private translate: TranslateService,
    private analytics: AnalyticsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.updateTwitterText();
    });
    this.mapToolService.usAverageLoaded.take(1).subscribe(() => this.updateTwitterText());
    // Needed to prevent ExpressionChangedAfterItHasBeenCheckedError
    this.cd.detectChanges();
  }

  /**
   * Update the eviction type (filing vs raw) for the app globally.
   * Triggered when the eviction type is changed in the graph and only
   * updates the type if "none" has not been specified on the map.
   */
  updateEvictionType(newType) {
    if (this.mapToolService.activeBubbleHighlight.id !== 'none') {
      this.mapToolService.setBubbleHighlight(newType.id);
    }
    this.updateTwitterText();
  }

  showDownloadDialog(e) {
    // Don't fire if no features
    if (this.displayLocations.length === 0) { return; }
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
    this.dialogService.showDialog(config, DownloadFormComponent)
      .subscribe((d) => { if (d.accepted) { this.trackDownload(d.filetypes); } });
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
    const downloadPDF = fileTypes.indexOf('pdf') > -1 ? 1 : 0;
    const downloadPPT = fileTypes.indexOf('pptx') > -1 ? 1 : 0;
    const downloadXLSX = fileTypes.indexOf('xlsx') > -1 ? 1 : 0;
    this.analytics.trackEvent('comparisonDataDownload', {
      comparisonDownloadType, downloadPDF, downloadPPT, downloadXLSX
    });
  }

  /**
   * Update Twitter share text
   * Note: This function must be debounced so that `this.platform.currentUrl`
   *  is accurate when called.
   */
  @Debounce(1000)
  updateTwitterText() {
    if (!this.mapToolService.activeBubbleHighlight) { return; }
    const featLength = this.locations.length;
    const yearSuffix = this.year.toString().slice(2);
    // Default to eviction rate if no highlight is set, sort by that property for share text
    const action = this.mapToolService.activeBubbleHighlight.id.startsWith('ef') ? 'efr' : 'er';
    let tweetParams: any = { year: this.year, link: this.platform.currentUrl() };
    let tweetTranslation = 'DATA.TWEET_NO_FEATURES';
    let feat, features;

    if (featLength === 0) {
      tweetTranslation = 'DATA.TWEET_NO_FEATURES';
    } else {
      // Sort by eviction rate if selected or total eviction filings
      const sortProp = `${action === 'er' ? action : 'ef'}-${yearSuffix}`;
      features = [ ...this.locations ].sort((a, b) =>
        a.properties[sortProp] > b.properties[sortProp] ? -1 : 1);

      // TODO: Potentially pull state abbreviation into place name
      feat = features[0].properties;
      tweetParams['place1'] = feat.n;
      // Set per day based off of property
      if (action === 'er') {
        tweetParams['perDay'] = feat[`epd-${yearSuffix}`];
      } else {
        const daysInYear = this.year % 4 === 0 ? 366 : 365;
        tweetParams['perDay'] = feat[`ef-${yearSuffix}`] > 0 ?
          +(feat[`ef-${yearSuffix}`] / daysInYear).toFixed(2) : -1;
      }
      tweetParams['total'] = this.decimal.transform(feat[`${action.slice(0, -1)}-${yearSuffix}`]);
      tweetParams['rate'] = this.cappedRateValue(feat[`${action}-${yearSuffix}`]);

      if (featLength === 1) {
        tweetParams['action'] = this.translatePipe.transform('DATA.TWEET_EVICTIONS');
        if (tweetParams['perDay'] >= 50) {
          tweetTranslation = 'DATA.TWEET_ONE_FEATURE_PER_DAY';
          tweetParams = { ...tweetParams, units: tweetParams['perDay'] };
        } else {
          tweetTranslation = 'DATA.TWEET_ONE_FEATURE';
        }
      } else if (featLength > 1) {
        tweetParams['action'] = this.translatePipe.transform('DATA.TWEET_EVICTED');
        if (featLength === 2) {
          tweetTranslation = 'DATA.TWEET_TWO_FEATURES';
          tweetParams = {
            ...tweetParams, place2: features[1].properties.n
          };
        } else if (featLength === 3) {
          tweetTranslation = 'DATA.TWEET_THREE_FEATURES';
          tweetParams = {
            ...tweetParams,
            place2: features[1].properties.n,
            place3: features[2].properties.n
          };
        }
      }
      // Adding separate filings suffix because they use different rules
      if (action === 'efr') {
        tweetTranslation += '_FILINGS';
      }
    }
    this.tweet = this.translatePipe.transform(tweetTranslation, tweetParams);
  }

  getEmbedUrl() {
    const url = this.platform.currentUrl();
    if (url.includes('#')) {
      const splitUrl = url.split('#');
      return [splitUrl[0], '#/embed', ...splitUrl.slice(1)].join('');
    } else {
      const splitUrl = url.split('/map/');
      return [splitUrl[0], '/map/embed/', ...splitUrl.slice(1)].join('');
    }
  }

  /** Returns the formatted rate number, with >100 instead of values over */
  private cappedRateValue(val: number): string {
    return val > 100 ? '>100' : this.decimal.transform(val, '1.1-2');
  }
}
