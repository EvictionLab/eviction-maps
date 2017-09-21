import { Component, OnInit, AfterViewInit, EventEmitter, ElementRef, HostListener, HostBinding, ViewChild, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-slider',
  templateUrl: './ui-slider.component.html',
  styleUrls: ['./ui-slider.component.scss']
})
export class UiSliderComponent implements OnInit, AfterViewInit {
  position = 0;
  get percent() { return (this.position * 100) + '%'; }
  @Input() min = 0;
  @Input() max = 100;
  @Input() currentValue = 0;
  @Input() step = 1;
  @Output() change = new EventEmitter<number>();
  @ViewChild('scrubber') scrubber;
  @HostBinding('class.active') pressed = false;
  private elRect = null;

  constructor(public el: ElementRef) { }

  ngOnInit() {
    this.currentValue = this.min;
  }

  ngAfterViewInit() {
    this.setSliderDimensions();
  }

  @HostListener('window:resize', ['$event']) onResize(e) {
    this.setSliderDimensions();
  }

  @HostListener('mousedown', ['$event']) onPress(e) {
    this.setScrubberPosition(e);
    this.pressed = true;
  }

  @HostListener('document:mousemove', ['$event']) onMove(e) {
    if (this.pressed) {
      this.setScrubberPosition(e);
    }
  }

  @HostListener('document:mouseup', ['$event']) onRelease(e) {
    if (this.pressed) {
      this.setScrubberPosition(e);
      this.pressed = false;
    }
  }

  // TODO: use this.step return values that fall within the step amount
  private getValue(): number {
    return Math.floor((this.max - this.min) * this.position) + this.min;
  }

  /**
   * update the dimensions of the parent element
   */
  private setSliderDimensions() {
    this.elRect = this.el.nativeElement.getBoundingClientRect();
  }

  /**
   * Set the scrubber position based on event values, but keep between 0 and 100
   * @param e the mouse event
   */
  private setScrubberPosition(e) {
    if (e.offsetX && this.elRect) {
      this.position = Math.min(
        1, Math.max(0, ((e.clientX - this.elRect.left) / this.elRect.width))
      );
      const newValue = this.getValue();
      if (newValue !== this.currentValue) {
        this.currentValue = newValue;
      }
      this.change.emit(newValue);
    }
  }
}
