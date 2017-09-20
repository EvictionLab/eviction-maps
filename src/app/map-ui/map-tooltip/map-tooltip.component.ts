import { Component, OnInit, Input } from '@angular/core';
import { I18nPluralPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-map-tooltip',
  templateUrl: './map-tooltip.component.html',
  styleUrls: ['./map-tooltip.component.scss']
})
export class MapTooltipComponent implements OnInit {

  @Input() feature;
  @Input() dataYear: number;
  evictionLabelMapping: {[k: string]: string} = {'=1': 'Eviction', 'other': 'Evictions'};

  constructor() { }

  ngOnInit() {
  }

}
