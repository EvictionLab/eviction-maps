import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ranking-scale',
  templateUrl: './ranking-scale.component.html',
  styleUrls: ['./ranking-scale.component.scss']
})
export class RankingScaleComponent implements OnInit {

  @Input() min: number;
  @Input() max: number;

  constructor() { }

  ngOnInit() {
  }

}
