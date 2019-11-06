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

  constructor(private decimal: DecimalPipe) {}

  ngOnInit() {}

  /** Determines if the tooltip is on the left or right side of the graph */
  isLeftSide(tooltip) {
    return true;
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
