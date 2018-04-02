import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxCarousel } from 'ngx-carousel';
import { AppDialog } from '../../ui/ui-dialog/ui-dialog.types';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-feature-overview',
  templateUrl: './feature-overview.component.html',
  styleUrls: ['./feature-overview.component.scss']
})
export class FeatureOverviewComponent implements OnInit, AfterViewInit, AppDialog {

  deployUrl = environment.deployUrl;
  carousel: NgxCarousel;
  slideIndex: number;
  animationSupport;
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
    this.animationSupport = this.supportsSVGTransforms();
    this.slideIndex = 0;
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
    this.slideIndex = data.currentSlide;
    if (!this.animationSupport) { return; }
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
    if (!this.animationSupport) { return; }
    svg.setAttribute('class', 'animate animation-' + (i + 1));
    this._animateInterval = setInterval(function() {
      svg.setAttribute('class', 'animation-' + (i + 1));
      setTimeout(function() { svg.setAttribute('class', 'animate animation-' + (i + 1)); }, 10);
    }, this._animationLength[i]);
  }

  private stopAnimations() {
    if (!this.animationSupport) { return; }
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

  // pulled from: http://eprev.org/2017/01/05/how-to-detect-if-css-transforms-are-supported-on-svg
  private supportsSVGTransforms() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 8 8');
    Object.assign(svg.style, {
      position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', zIndex: 99999
    });
    svg.innerHTML =
      '<rect width="4" height="4" fill="#fff" style="transform: translate(4px, 4px)"/>';
    document.body.appendChild(svg);
    const result = document.elementFromPoint(6, 6) !== svg;
    svg.parentNode.removeChild(svg);
    return result;
  }

}
