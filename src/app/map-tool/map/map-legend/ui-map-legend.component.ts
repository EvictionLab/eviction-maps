import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ui-map-legend',
  templateUrl: './ui-map-legend.component.html',
  styleUrls: ['./ui-map-legend.component.scss'],
  providers: [ TranslatePipe ]
})
export class UiMapLegendComponent implements OnChanges {
  /** Current `MapDataAttribute` being shown for choropleths */
  @Input() choropleth;
  /** Current `MapDataAttribute` being shown for bubbles */
  @Input() bubbles;
  /** Current data layer being shown on the map */
  @Input() layer;
  /** Gets the fill stops based on the selected choropleth */
  get stops() {
    if (!this.choropleth || !this.layer) { return null; }
    return this.choropleth.stops[this.layer.id] || this.choropleth.stops['default'];
  }
  hintData;
  legendGradient;

  constructor(private sanitizer: DomSanitizer, private translatePipe: TranslatePipe) {}

  /** Set the hint data and gradient when inputs change */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('layer') || changes.hasOwnProperty('choropleth')) {
      if (this.choropleth) {
        this.setHintData();
        this.setLegendGradient();
      }
    }
  }

  /** Sets the tooltip hint */
  setHintData() {
    if (!this.choropleth.name || !this.layer.name) { return; }
    this.hintData = this.translatePipe.transform('MAP.LEGEND_HINT', {
      geography: this.stripHtmlFromString(this.layer['name']).toLowerCase(),
      attribute: this.choropleth['name'].toLowerCase(),
      min: this.formatType(this.stops[1][0]),
      max: this.formatType(this.stops[this.stops.length - 1][0])
    });
  }

  /** Sets the CSS background gradient for the legend */
  setLegendGradient() {
    if (this.stops && this.stops.length) {
      this.legendGradient = this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(
          to right, ${this.stops[1][1]}, ${this.stops[this.stops.length - 1][1]}
      )`);
    } else {
      this.legendGradient = null;
    }
  }

  /**
   * Formats the provided value to a string, abbreviates numbers larger than
   * 10000 with 'k', numbers larger than 1000000 with 'm', rounded to 2 decimal places
   * @param value the number to format
   */
  formatValue(value: any) {
    let formattedValue: any = parseInt(value, 10);
    switch (true) {
      case (value >= 10000 && value < 1000000):
        formattedValue = (Math.round((value / 1000) * 100) / 100) + 'k';
        break;
      case (value >= 1000000):
        formattedValue = (Math.round((value / 1000000) * 100) / 100) + 'm';
        break;
    }
    return this.formatType(formattedValue);
  }

  /**
   * adds a % or $ if the choropleth has that format specified.
   */
  formatType(value: any) {
    if (this.choropleth.format) {
      switch (this.choropleth.format) {
        case 'percent':
          return value + '%';
        case 'dollar':
          return '$' + value;
      }
    }
    return value;
  }

  private stripHtmlFromString(htmlString: string) {
    return htmlString.replace(/<(?:.|\n)*?>*.<\/(?:.|\n)*?>+/g, '');
  }

}
