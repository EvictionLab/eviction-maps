import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ranking-scale',
  templateUrl: './ranking-scale.component.html',
  styleUrls: ['./ranking-scale.component.scss'],
  providers: [DecimalPipe]
})
export class RankingScaleComponent {

  @Input() min = 0;
  @Input() max = 1;
  private numTicks = 5;

  getTicks(): Array<number> {
    const range = this.max - this.min;
    const tickAmount = range / this.numTicks;
    const tick = [];
    for (let i = 0; i < this.numTicks; i++) {
      tick.push(this.min + (tickAmount * i));
    }
    return tick;
  }

}
