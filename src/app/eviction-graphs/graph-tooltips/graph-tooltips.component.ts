import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-graph-tooltips',
  templateUrl: './graph-tooltips.component.html',
  styleUrls: ['./graph-tooltips.component.scss']
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

  ngOnInit() {}

  /** Determines if the tooltip is on the left or right side of the graph */
  isLeftSide(tooltip) {
    return true;
  }

  /** track tooltips by ID so they are animated properly */
  trackTooltips(index, item) { return item.id; }

  tooltipValue(val: number): string {
    let valStr = val.toString();
    if (this.maxVal > 0 && val > this.maxVal) {
      valStr = '>' + this.maxVal;
    }
    return `${valStr}${this.format === 'percent' ? '%' : ''}`;
  }

  barTopValue(top: number): number {
    return top;
  }

}
