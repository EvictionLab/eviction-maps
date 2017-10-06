import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  indeterminate = true;
  // Input shoud be between 0 and 1
  @Input() progress: number;
  get percent(): string { return (this.progress * 100) + '%'; }

  constructor() { }

  ngOnInit() {
    this.indeterminate = typeof this.progress !== 'number';
  }

}
