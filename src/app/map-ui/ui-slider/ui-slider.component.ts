import { Component, AfterViewInit, EventEmitter, ElementRef, HostListener, HostBinding, ViewChild, Input, Output } from '@angular/core';

// TODO: add key bindings

@Component({
  selector: 'app-ui-slider',
  templateUrl: './ui-slider.component.html',
  styleUrls: ['./ui-slider.component.scss']
})
export class UiSliderComponent implements AfterViewInit {
  position = 0;
  get percent() { return (this.position * 100) + '%'; }
  @Input() vertical = false;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Output() change = new EventEmitter<number>();
  @ViewChild('scrubber') scrubber;
  @HostBinding('class.active') pressed = false;
  private elRect = null;
  private _currentValue = 0;

  /**
   * Using getter and setter on currentValue to handle
   * updates from external components
   */
  @Input() set currentValue(value) {
    this.setValue(value);
  }

  get currentValue() {
    return this._currentValue;
  }

  constructor(public el: ElementRef) { }

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
  setValue(val: number = this._currentValue) {
    this._currentValue = this.getStepValue(Math.min(this.max, Math.max(this.min, val)));
    this.position = (this._currentValue - this.min) / (this.max - this.min);
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
    const offset = this.vertical ? e.offsetY : e.offsetX;
    if (offset && this.elRect) {
      let maxVal;
      if (this.vertical) {
        const elTotal = Math.abs(this.elRect.x) + this.elRect.width;
        maxVal  = Math.max(0, ((elTotal - e.clientY) / this.elRect.width));
      } else {
        maxVal = Math.max(0, ((e.clientX - this.elRect.left) / this.elRect.width));
      }
      this.setValue(maxVal);
      this.position = Math.min(1, maxVal);
      const newValue = this.getStepValue();
      if (newValue !== this.currentValue) {
        this.currentValue = newValue;
        this.change.emit(newValue);
      }
    }
  }
}
