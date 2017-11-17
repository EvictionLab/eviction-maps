import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  @Output() selectMenuItem = new EventEmitter();
  @Output() selectLocation = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
