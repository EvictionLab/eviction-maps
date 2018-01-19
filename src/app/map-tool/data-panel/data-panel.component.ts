import {
  Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { DownloadFormComponent } from './download-form/download-form.component';
import { UiDialogService } from '../../ui/ui-dialog/ui-dialog.service';
import { MapFeature } from '../map/map-feature';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { PlatformService } from '../../platform.service';
import { PlatformLocation } from '@angular/common';
import { DataService } from '../../data/data.service';
import { DollarProps, PercentProps } from '../../data/data-attributes';

@Component({
  selector: 'app-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
  providers: [ TranslatePipe ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataPanelComponent implements OnInit, OnChanges {
  private _year: number;
  @Input() set year(newYear: number) {
    if (newYear !== this._year) {
      this.yearChange.emit(newYear);
    }
    this._year = newYear;
  }
  get year() { return this._year; }
  @Output() yearChange = new EventEmitter();
  @Input() locations: MapFeature[] = [];
  @Output() locationRemoved = new EventEmitter();
  @Output() locationAdded = new EventEmitter();
  get barGraphSettings() {
    return {
      axis: {
        x: { label: null, tickFormat: '.0f' },
        y: {
          label: this.translatePipe.transform(this.cardProps[this.graphProp]),
          tickSize: '-100%',
          ticks: 5,
          tickPadding: 5
        }
      },
      margin: { left: 65, right: 16, bottom: 32, top: 16 }
    };
  }
  get lineGraphSettings() {
    return {
      axis: {
        x: {
          label: null,
          tickFormat: '.0f',
          ticks: Math.min(5, this.lineEndYear - this.lineStartYear),
          tickPadding: 10
        },
        y: {
          label: this.translatePipe.transform(this.cardProps[this.graphProp]),
          tickSize: '-100%',
          ticks: 5,
          tickPadding: 5
        }
      },
      margin: { left: 65, right: 16, bottom: 48, top: 16 }
    };
  }
  graphData;
  tooltips = [];
  graphType = 'line';
  cardProps = {
    'er': 'STATS.JUDGMENT_RATE',
    'e': 'STATS.JUDGMENTS',
    'efr': 'STATS.FILING_RATE',
    'ef': 'STATS.FILINGS',
    'pr': 'STATS.POVERTY_RATE',
    'p': 'STATS.POPULATION',
    'pro': 'STATS.PCT_RENTER',
    'mgr': 'STATS.MED_RENT',
    'mpv': 'STATS.MED_PROPERTY',
    'mhi': 'STATS.MED_INCOME',
    'divider': 'STATS.DEMOGRAPHICS',
    'pw': 'STATS.PCT_WHITE',
    'paa': 'STATS.PCT_AFR_AMER',
    'ph': 'STATS.PCT_HISPANIC',
    'pai': 'STATS.PCT_AMER_INDIAN',
    'pa': 'STATS.PCT_ASIAN',
    'pnp': 'STATS.PCT_HAW_ISL',
    'pm': 'STATS.PCT_MULTIPLE',
    'po': 'STATS.PCT_OTHER'
  };
  graphProp = 'er';
  graphSettings;
  startSelect: Array<number>;
  tweetTranslation = 'DATA.TWEET_ONE_FEATURE';
  tweetParams = {};

  endSelect: Array<number>;
  barYearSelect: Array<number>;
  minYear = 2000;
  lineStartYear: number = this.minYear;
  maxYear = 2016;
  lineEndYear: number = this.maxYear;
  dollarProps = DollarProps;
  percentProps = PercentProps;
  graphHover = new EventEmitter();
  private graphTimeout; // tracks if a timeout is set to update graph settings

  constructor(
    public dialogService: UiDialogService,
    public dataService: DataService,
    private translatePipe: TranslatePipe,
    private translate: TranslateService,
    private platform: PlatformService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.barYearSelect = this.generateYearArray(this.minYear, this.maxYear);
    // Update graph axis settings on language change
    this.translate.onLangChange.subscribe(() => {
      this.graphSettings = this.graphType === 'bar' ?
        this.barGraphSettings : this.lineGraphSettings;
      this.updateTwitterText();
    });
    this.dataService.locations$.subscribe(d => {
      this.setGraphData();
      this.updateTwitterText();
    });
    this.graphHover.debounceTime(50)
      .subscribe(e => this.onGraphHover(e));
    // Needed to prevent ExpressionChangedAfterItHasBeenCheckedError
    this.cd.detectChanges();
  }

  /**
   * Update the graph data when locations or year changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations) {
      this.setGraphData();
      this.updateTwitterText();
    }
  }

  /**
   * Updates the bar to the provided year
   * @param year
   */
  updateBarYear(year: number) {
    this.year = year;
    this.setGraphData();
  }

  /**
   * Updates the graph to the `start` and `end` X values
   */
  updateLineYears(start: any, end: any) {
    this.lineStartYear = Number(start);
    this.lineEndYear = Math.max(Number(end), this.lineStartYear + 1);
    this.startSelect = this.generateYearArray(this.minYear, this.lineEndYear - 1);
    this.endSelect = this.generateYearArray(this.lineStartYear + 1, this.maxYear);
    this.setGraphData();
  }

  /**
   * Sets the tooltip data on graph hover, or empty array if none
   * @param hoverItems the currently hovered item(s)
   */
  onGraphHover(hoverItems) {
    this.tooltips = hoverItems ?
      (this.graphType === 'bar' ? [ hoverItems ] : hoverItems) :
      [];
  }

  /** track tooltips by ID so they are animated properly */
  trackTooltips(index, item) { return item.id; }

  /** changes graph to either line or bar and resets tooltips */
  changeGraphType(newType: string) {
    this.graphType = newType.toLowerCase();
    this.tooltips = [];
  }

  /**
   * Toggles the graph between judgments / filings
   */
  changeGraphProperty(filings: boolean) {
    this.graphProp = filings ? 'efr' : 'er';
    this.setGraphData();
  }

  showDownloadDialog(e) {
    const config = {
      lang: this.translate.currentLang,
      year: this.year,
      startYear: this.lineStartYear,
      endYear: this.lineEndYear,
      features: this.locations,
      dataProp: this.dataService.activeDataHighlight.id,
      bubbleProp: this.dataService.activeBubbleHighlight.id
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
   * Sets the data for the graph, and any settings specific to the type
   */
  setGraphData() {
    this.tooltips = [];
    if (this.graphType === 'line') {
      this.graphSettings = this.lineGraphSettings;
      this.graphData = [...this.createLineGraphData()];
    } else {
      this.graphSettings = this.barGraphSettings;
      this.graphData = [...this.createBarGraphData()];
    }
    this.setGraphSettings();
  }

  /**
   * Sets the settings for the graph
   * WARNING: something with the dimensions is not set correctly when updating settings
   *  delaying the update in a timeout seems to fix the issue.
   */
  setGraphSettings() {
    if (this.graphTimeout) { clearTimeout(this.graphTimeout); } // clear timeout if one is set
    this.graphTimeout = setTimeout(() => {
      const settings = this.graphType === 'line' ? this.lineGraphSettings : this.barGraphSettings;
      this.graphSettings = { ...settings };
      this.graphTimeout = null;
    }, 1250);
  }

  /**
   * Creates an array with number values from `start` to `end`
   */
  generateYearArray(start: number, end: number): Array<number> {
    const arr = [];
    for (let i = start; i <= end; i++) { arr.push(i); }
    if (arr.length === 0) { arr.push(end); }
    return arr;
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

  getTooltipsYear(tooltips: Object[]) {
    for (let i = 0; i < tooltips.length; ++i) {
      if (tooltips[i]['x'] !== null) {
        return tooltips[i]['x'];
      }
    }
    return null;
  }

  /**
   * Genrates line graph data from the features in `locations`
   */
  private createLineGraphData() {
    return this.locations.map((f, i) => {
      return { id: 'sample' + i, data: this.generateLineData(f) };
    });
  }

  /**
   * Generate bar graph data from the features in `locations
   */
  private createBarGraphData() {
    return this.locations.map((f, i) => {
      const yVal = (f.properties[`${this.graphProp}-${('' + this.year).slice(2)}`]);
      return {
        id: 'sample' + i,
        data: [{
          x: f.properties.n,
          y: yVal ? yVal : 0
        }]
      };
    });
  }

  private generateLineData(feature) {
    return this.generateYearArray(this.lineStartYear, this.lineEndYear)
      .map((year) => {
        // create points
        const yVal = feature.properties[`${this.graphProp}-${('' + year).slice(2)}`];
        return { x: year, y: yVal !== -1 && yVal !== null ? yVal : undefined };
      });
  }

}
