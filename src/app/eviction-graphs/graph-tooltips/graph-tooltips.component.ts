import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-graph-tooltips',
  templateUrl: './graph-tooltips.component.html',
  styleUrls: ['./graph-tooltips.component.scss'],
  providers: [ DecimalPipe ]
})
export class GraphTooltipsComponent implements OnInit {

  /** Data to render tooltips */
  @Input() tooltips;
  /** Which type of graph to show tooltips for */
  @Input() graphType;
  /** Determines how the tooltips will be formatted */
  @Input() format: string;
  /** Maximum y value */
  @Input() maxVal: number;
  /** Display CI Boolean */
  @Input() displayCI: boolean;
  /** Determines which side the tooltips show on */
  tooltipPos = 'left';
  /** Data to render location names */
  @Input() locations;
  /** Data to render US average */
  @Input() average;


  constructor(private decimal: DecimalPipe) {}

  ngOnInit() {}

  /** Determines if the tooltip is on the left or right side of the graph */
  isLeftSide(tooltip) {
    return true;
  }

  /** Generates text for the value label under the location in the legend */
  getLegendValue(location, locationIndex: number): string {
    if (!location) { return ''; }
    // average is GraphItem so use `data` if `properties` is not available
    const l = location.properties || location.data;
    if (this.graphType === 'bar') {
      const value = l[this.attrYear(this.barYear)];
      return value >= 0 ?
        this.barYear + ': ' + this.formatValue(value, this.graphAttribute.format) :
        this.translatePipe.transform('DATA.UNAVAILABLE');
    } else if (this.graphType === 'line') {
      const tooltip = this.tooltips[locationIndex];
      if (!tooltip) { return ''; }
      const value = l[this.attrYear(tooltip.x)];
      return value >= 0 ?
        tooltip.x + ': ' + this.formatValue(value, this.graphAttribute.format) :
        this.translatePipe.transform('DATA.UNAVAILABLE');
    }
    return '';
  }

  /** Generates text for the value label under the location in the legend */
  getLegendCI(location, locationIndex: number, high: string, low: string): string {
    // console.log('getLegendCI()');
    if (!location) { return ''; }
    if (!this.graphSettings.ci.display) { return ''; }
    const _high = this.translatePipe.transform('DATA.CI_HIGH');
    const _low = this.translatePipe.transform('DATA.CI_LOW');
    // average is GraphItem so use `data` if `properties` is not available
    const l = location.properties || location.data;
    if (this.graphType === 'bar') {
      const ciH = l[this.attrCIYear(this.barYear, 'h')];
      const ciL = l[this.attrCIYear(this.barYear, 'l')];
      return (ciH > 0 && ciL > 0) ?
        `(${_high}${Number(ciH).toFixed(2)}%/${_low}${Math.abs(Number(Number(ciL).toFixed(2)))}%)`
        : '';
    } else if (this.graphType === 'line') {
      const tooltip = this.tooltips[locationIndex];
      if (!tooltip) { return ''; }
      return (tooltip.ciH > 0 && tooltip.ciL > 0) ?
        this.tooltipValueCIs(tooltip) : '';
    }
    return '';
  }

  /** track tooltips by ID so they are animated properly */
  trackTooltips(index, item) { return item.id; }

  getTooltipCI(num) {
    return Math.abs(Number(Number(num).toFixed(2)));
  }

  tooltipValue(tooltip): string {
    // console.log('tooltipValue()');
    let valStr = this.decimal.transform(tooltip.y);
    if (this.maxVal > 0 && tooltip.y > this.maxVal) {
      valStr = '>' + this.maxVal;
    }
    return `${valStr}${tooltip.format === 'percent' ? '%' : ''}`;
  }

  barTopValue(top: number): number {
    return top;
  }

}
