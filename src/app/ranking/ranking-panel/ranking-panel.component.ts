import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RankingLocation } from '../ranking-location';

@Component({
  selector: 'app-ranking-panel',
  templateUrl: './ranking-panel.component.html',
  styleUrls: ['./ranking-panel.component.scss'],
  providers: [DecimalPipe]
})
export class RankingPanelComponent {
  @Input() year: number;
  @Input() rank: number;
  @Input() topCount: number;
  @Input() location: RankingLocation;
  @Input() dataProperty: { name: string, value: string };
  @Output() goToPrevious = new EventEmitter();
  @Output() goToNext = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() locationClick = new EventEmitter<number>();

  constructor(public el: ElementRef) {}

}
