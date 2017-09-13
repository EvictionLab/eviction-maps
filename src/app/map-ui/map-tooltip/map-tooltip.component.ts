import { Component, OnInit, Input } from '@angular/core';
import { I18nPluralPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-map-tooltip',
  templateUrl: './map-tooltip.component.html',
  styleUrls: ['./map-tooltip.component.css']
})
export class MapTooltipComponent implements OnInit {

  @Input() feature;
  evictionLabelMapping: {[k: string]: string} = {'=1': 'Eviction', 'other': 'Evictions'};

  constructor() { }

  ngOnInit() {
  }

}
