import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'app-feature-overview',
  templateUrl: './feature-overview.component.html',
  styleUrls: ['./feature-overview.component.scss']
})
export class FeatureOverviewComponent implements OnInit {

  carousel: NgxCarousel;
  @Output() closed = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.carousel = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      touch: false,
      loop: false,
      custom: 'banner'
    };
  }

  onCancelClick(e) {
    this.closed.emit();
    this.bsModalRef.hide();
  }

}
