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

  tooltipValueCIs(tooltip): string {
    let _return = '';
    if (tooltip.ciH || tooltip.ciL) {
      _return += '\n\n(';
      if (tooltip.ciH) {
        _return += '+' + Number(tooltip.ciH).toFixed(2);
      }
      if (tooltip.ciH && tooltip.ciL) {
        _return += '/';
      }
      if (tooltip.ciL) {
        _return += '-' + Number(tooltip.ciL).toFixed(2);
      }
      _return += ')';
    }
    return _return;
  }

  tooltipValue(tooltip): string {
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
