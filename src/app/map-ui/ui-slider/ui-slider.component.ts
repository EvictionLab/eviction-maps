import { Component, OnInit, AfterViewInit, EventEmitter, ElementRef, HostListener, HostBinding, ViewChild, Input, Output } from '@angular/core';

// TODO: add key bindings

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

  /**
   * Set the value on init
   */
  ngOnInit() {
    if (!this.currentValue) { this.currentValue = this.min; }
    this.setValue(this.currentValue);
  }

  /**
   * Set the slider dimensions when the element is ready
   */
  ngAfterViewInit() { this.setSliderDimensions(); }

  /**
   * Update the slider dimensions when the window resizes
   * @param e window resize event
   */
  @HostListener('window:resize', ['$event']) onResize(e) {
    this.setSliderDimensions();
  }

  /**
   * Set the pressed status and scrubber position when element is pressed
   * @param e mousedown event
   */
  @HostListener('mousedown', ['$event']) onPress(e) {
    this.setScrubberPosition(e);
    this.pressed = true;
  }

  /**
   * If the scrubber is currently pressed, update the position when the
   * mouse moves.
   * @param e mousemove event
   */
  @HostListener('document:mousemove', ['$event']) onMove(e) {
    if (this.pressed) {
      this.setScrubberPosition(e);
    }
  }

  /**
   * Remove the pressed status and update scrubber position when released
   * after dragging or clicking
   * @param e mousup event
   */
  @HostListener('document:mouseup', ['$event']) onRelease(e) {
    if (this.pressed) {
      this.setValue();
      this.pressed = false;
    }
  }

  // TODO: use this.step return values that fall within the step amount
  private getStepValue(val?: number): number {
    const step = 1 / this.step;
    if (!val) { val = ((this.max - this.min) * this.position + this.min); }
    return (Math.round((val * step)) / step);
  }


  /**
   * Set the value and scrubber position
   * @param val the slider value
   */
  setValue(val: number = this.currentValue) {
    this.currentValue = this.getStepValue(Math.min(this.max, Math.max(this.min, val)));
    this.position = (this.currentValue - this.min) / (this.max - this.min);
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
      const newValue = this.getStepValue();
      if (newValue !== this.currentValue) {
        this.currentValue = newValue;
        this.change.emit(newValue);
      }
    }
  }
}
