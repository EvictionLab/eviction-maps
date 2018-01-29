import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectorRef
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { DownloadFormComponent } from './download-form/download-form.component';
import { UiDialogService } from '../../ui/ui-dialog/ui-dialog.service';
import { MapFeature } from '../map/map-feature';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { PlatformService } from '../../platform.service';
import { PlatformLocation } from '@angular/common';
import { DataService } from '../../data/data.service';

@Component({
  selector: 'app-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
  providers: [ TranslatePipe ]
})
export class DataPanelComponent implements OnInit, OnChanges {

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
  allLocations: MapFeature[] = []; // Locations including US average if toggled
  @Input() set locations(locations: MapFeature[]) {
    this.displayLocations = locations;
    this.allLocations = locations.concat([this.createUsAverageFeature()]);
  }
  get locations() { return this.displayLocations; }
  @Output() locationRemoved = new EventEmitter();
  @Output() locationAdded = new EventEmitter();

  /** Card properties */
  @Input() cardProperties;

  tweetTranslation = 'DATA.TWEET_ONE_FEATURE';
  tweetParams = {};

  constructor(
    public dialogService: UiDialogService,
    public dataService: DataService,
    private translatePipe: TranslatePipe,
    private translate: TranslateService,
    private platform: PlatformService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataService.locations$.subscribe(d => {
      this.setGraphData();
      this.updateTwitterText();
    });
    this.translate.onLangChange.subscribe(() => {
      this.updateTwitterText();
    });
    // Needed to prevent ExpressionChangedAfterItHasBeenCheckedError
    this.cd.detectChanges();
  }

  /**
   * Update the graph data when locations or year changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations) {
      this.updateTwitterText();
    }
  }

  showDownloadDialog(e) {
    const config = {
      lang: this.translate.currentLang,
      year: this.year,
      startYear: this.lineStartYear,
      endYear: this.lineEndYear,
      features: this.displayLocations,
      dataProp: this.dataService.activeDataHighlight.id,
      bubbleProp: this.dataService.activeBubbleHighlight.id,
      showUsAverage: this.showUS,
      usAverage: this.dataService.usAverage
    };
    this.dialogService.showDownloadDialog(DownloadFormComponent, config);
  }

  showFileDialog(e) {
    this.dialogService.showDialog({
      title: 'Select a file type',
      content: [
        { type: 'text', data: 'Check one or more of the file types:' },
        { type: 'checkbox', data: { value: false, label: 'PDF' } },
        { type: 'checkbox', data: { value: false, label: 'Excel' } }
      ]
    }).subscribe((response) => {
      console.log(response);
    });
  }

  /**
   * Update Twitter share text
   */
  updateTwitterText() {
    const features = this.dataService.activeFeatures;
    const featLength = this.dataService.activeFeatures.length;
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
   * Adding method because calling window directly in the template doesn't work
   */
  getCurrentUrl() {
    return window.location.href;
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

    window.addEventListener('blur', () => clearTimeout(timeout));
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

  abbrYear(year) { return year.toString().slice(-2); }

  /**
   * Return % or other suffix if in property list
   * TODO: Duplicated from location-cards, need to refactor
   * @param prop
   */
  suffix(prop: string) {
    if (this.percentProps.indexOf(prop) !== -1) {
      return '%';
    }
    return null;
  }

  private getLocations(): MapFeature[] {
    return this.showUS ? this.allLocations : this.displayLocations;
  }

  private createUsAverageFeature(): MapFeature {
    return {
      type: 'Feature',
      properties: { n: 'United States', ...this.dataService.usAverage },
      geometry: { type: 'Point', coordinates: [] }
    };
  }
}
