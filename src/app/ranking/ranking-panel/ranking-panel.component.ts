import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ElementRef
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RankingLocation } from '../ranking-location';

@Component({
  selector: 'app-ranking-panel',
  templateUrl: './ranking-panel.component.html',
  styleUrls: ['./ranking-panel.component.scss'],
  providers: [DecimalPipe]
})
export class RankingPanelComponent implements AfterViewInit {
  @Input() rank: number;
  @Input() topCount: number;
  @Input() location: RankingLocation;
  @Input() dataProperty: { name: string, value: string };
  @Output() goToPrevious = new EventEmitter();
  @Output() goToNext = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() locationClick = new EventEmitter<number>();

  constructor(public el: ElementRef) {}

  /**
   * Grab focus when the panel opens
   * NOTE / TODO: Giving focus to the ranking panel will scroll the page to the bottom
   *    which is not desired behaviour. Alternatively, the user will need to tab through
   *    the entire list to get focus of an element in the ranking panel.  Commenting
   *    out the focus until we determine a best approach.
   */
  ngAfterViewInit() {
    // setTimeout(() => {
    //   const buttons = this.el.nativeElement.getElementsByTagName('button');
    //   if (buttons.length) {
    //     buttons[0].focus();
    //   }
    // }, 800);
  }

}
