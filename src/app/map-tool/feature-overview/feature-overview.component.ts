import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxCarousel } from 'ngx-carousel';
import { AppDialog } from '../../ui/ui-dialog/ui-dialog.types';

@Component({
  selector: 'app-feature-overview',
  templateUrl: './feature-overview.component.html',
  styleUrls: ['./feature-overview.component.scss']
})
export class FeatureOverviewComponent implements OnInit, AfterViewInit, AppDialog {

  carousel: NgxCarousel;
  @Output() buttonClicked = new EventEmitter();
  private _animationLength = {
    '0': 6000,
    '1': 6000,
    '2': 6000,
    '3': 7000,
    '4': 6000
  };
  private _animateInterval = null;

  constructor(public bsModalRef: BsModalRef, public el: ElementRef) { }

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

  ngAfterViewInit() {
    this.triggerAnimation(this.getSvgEl(0), 0);
  }

  /** No config for this dialog */
  setDialogConfig(config: any) {}

  slideActivated(data) {
    console.log(data);
    const svg = this.getSvgEl(data.currentSlide);
    if (svg) {
      this.stopAnimations();
      this.triggerAnimation(svg, data.currentSlide);
    }
  }

  onCancelClick(e) {
    this.buttonClicked.emit({ accepted: false });
    this.bsModalRef.hide();
  }

  private triggerAnimation(svg, i: number) {
    svg.setAttribute('class', 'animate animation-' + (i + 1));
    this._animateInterval = setInterval(function() {
      svg.setAttribute('class', 'animation-' + (i + 1));
      setTimeout(function() { svg.setAttribute('class', 'animate animation-' + (i + 1)); }, 10);
    }, this._animationLength[i]);
  }

  private stopAnimations() {
    if (this._animateInterval) { clearInterval(this._animateInterval); }
    this.getAllSvgs()
      .forEach((svg, i) => svg.setAttribute('class', 'animation-' + (i + 1)));
  }

  private getSvgEl(i: number) {
    if (!i && i !== 0) { return; }
    return this.getAllSvgs()[i];
  }

  private getAllSvgs(): Element[] {
    return Array.from(this.el.nativeElement.querySelectorAll('.slide-animation svg'));
  }

}
