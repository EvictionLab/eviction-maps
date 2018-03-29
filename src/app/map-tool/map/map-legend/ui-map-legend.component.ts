import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { PlatformService } from '../../../services/platform.service';

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
  /** Current map zoom, used in setting bubble legend values */
  @Input() zoom: number;
  /** Gets the fill stops based on the selected choropleth */
  stops;
  /** Radius and values for bubble legend. Max value changes with screen size */
  minBubbleRadius = 4;
  get maxBubbleRadius() { return this.platform.isLargerThanMobile ? 12 : 8; }
  minBubbleValue: number;
  maxBubbleValue: number;
  hasBubbles = false;
  hasChoropleth = false;
  hintData;
  legendGradient;

  constructor(
    private sanitizer: DomSanitizer,
    private translatePipe: TranslatePipe,
    private platform: PlatformService
  ) {}

  /** Set the hint data and gradient when inputs change */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('layer') || changes.hasOwnProperty('choropleth')) {
      if (this.choropleth) {
        this.setChoroplethValues();
      }
    }
    if (
      changes.hasOwnProperty('layer') ||
      changes.hasOwnProperty('bubbles') ||
      changes.hasOwnProperty('zoom')
    ) {
      if (this.bubbles) {
        this.setBubbleValues();
      }
    }
  }

  /** Sets the tooltip hint */
  setHintData() {
    if ((!this.choropleth.name || !this.bubbles.name) || !this.layer.name) { return; }
    const legendText = [];
    if (this.hasChoropleth) {
      legendText.push(this.translatePipe.transform('MAP.CHORO_LEGEND_HINT', {
        geography: this.stripHtmlFromString(this.layer['name']).toLowerCase(),
        attribute: this.choropleth['name'].toLowerCase(),
        min: this.formatType(this.stops[2]),
        max: this.formatType(this.stops[this.stops.length - 2])
      }));
    }
    if (this.hasBubbles) {
      legendText.push(this.translatePipe.transform('MAP.BUBBLE_LEGEND_HINT', {
        attribute: this.bubbles.name.toLowerCase()
      }));
    }
    this.hintData = legendText.join(' ');
  }

  setBubbleValues() {
    console.log(this.bubbles);
    if (this.bubbles && this.bubbles.id !== 'none') {
      this.hasBubbles = true;
      const expr = this.layer.id in this.bubbles['expressions'] ?
        this.bubbles['expressions'][this.layer.id] : this.bubbles['expressions']['default'];
      const steps = expr[3].slice(3);
      this.minBubbleValue = this.bubbleValue(this.minBubbleRadius, this.zoom, steps);
      this.maxBubbleValue = this.bubbleValue(this.maxBubbleRadius, this.zoom, steps);
      this.setHintData();
    } else {
      this.hasBubbles = false;
    }
  }

  setChoroplethValues() {
    console.log(this.choropleth);
    if (!this.choropleth || !this.layer) { return; }
    if (this.choropleth && this.choropleth.id !== 'none') {
      this.hasChoropleth = true;
      this.stops = this.choropleth.stops[this.layer.id] || this.choropleth.stops['default'];
      this.setLegendGradient();
      this.setHintData();
    } else {
      this.hasChoropleth = false;
    }
  }

  /** Sets the CSS background gradient for the legend */
  setLegendGradient() {
    if (this.stops && this.stops.length) {
      this.legendGradient = this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(
          to right, ${this.stops[3]}, ${this.stops[this.stops.length - 1]}
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

  /**
   * Performs nested interpolation for the Mapbox expression to get
   * the value for a given circle radius
   * @param radius
   * @param mapZoom
   * @param steps
   */
  private bubbleValue(radius: number, zoom: number, steps: any[]) {
    const minZoom = steps[0];
    const minVal = this.interpolateSteps(radius, steps[1].slice(3));
    const maxZoom = steps[steps.length - 2];
    const maxVal = this.interpolateSteps(radius, steps[steps.length - 1].slice(3));

    // Don't return less than 0
    return Math.max(0, this.interpolateSteps(zoom, [minVal, minZoom, maxVal, maxZoom]));
  }

  /**
   * Linear interpolation function, based on Mapbox GL JS implementation
   * https://github.com/mapbox/mapbox-gl-js/blob/03680eb57489cf442f8c538141ea27c73d98d532/
   * src/style-spec/expression/definitions/interpolate.js
   * @param steps
   * @param value
   */
  private interpolateSteps(value: number, steps: any[]) {
    const labels = [];
    const outputs = [];
    for (let i = 0; i < steps.length; i += 2) {
      labels.push(steps[i]);
      outputs.push(steps[i + 1]);
    }
    const stepCount = labels.length;

    if (value <= outputs[0]) {
      return labels[0];
    }
    if (value >= outputs[stepCount - 1]) {
      return labels[stepCount - 1];
    }

    const index = this.findClosestStop(outputs, value);
    const lower = outputs[index];
    const upper = outputs[index + 1];

    const difference = upper - lower;
    const progress = value - lower;
    const t = difference === 0 ? 0 : progress / difference;

    const valLower = labels[index];
    const valUpper = labels[index + 1];
    return (valLower * (1 - t)) + (valUpper * t);
  }

  /**
   * Pulled from Mapbox GL JS, finds index of closest stop
   * @param steps
   * @param value
   */
  private findClosestStop(steps: number[], input: number) {
    const n = steps.length;
    let lowerIdx = 0;
    let upperIdx = n - 1;
    let idx = 0;
    let val, upper;

    while (lowerIdx <= upperIdx) {
      idx = Math.floor((lowerIdx + upperIdx) / 2);
      val = steps[idx];
      upper = steps[idx + 1];
      if (input === val || input > val && input < upper) {
        return idx;
      } else if (val < input) {
        lowerIdx = idx + 1;
      } else if (val > input) {
        upperIdx = idx - 1;
      } else {
        throw new Error('Input is not a number');
      }
    }
    return Math.max(idx - 1, 0);
  }
}
