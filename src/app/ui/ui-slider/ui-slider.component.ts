import {
  Component, EventEmitter, ChangeDetectorRef, ElementRef, AfterViewInit, HostListener, HostBinding,
  ViewChild, Input, Output
} from '@angular/core';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-ui-slider',
  templateUrl: './ui-slider.component.html',
  styleUrls: ['./ui-slider.component.scss']
})
export class UiSliderComponent implements AfterViewInit {
  @Input()
  set value(value: number) {
    const boundsValue = (this.min && this.max) ?
      Math.min(this.max, Math.max(this.min, value)) : value;
    this._currentValue = this.getStepValue(boundsValue);
    this.updatePosition(this._currentValue);
  }
  get value(): number {
    return this._currentValue;
  }
  @Input() label;
  @Input() min;
  @Input() max;
  @Input() step = 1;
  @Output() valueChange = new EventEmitter<number>();
  @ViewChild('scrubber') scrubber: ElementRef;
  @ViewChild('container') el: ElementRef;
  @HostBinding('class.active') pressed = false;
  @HostBinding('attr.role') ariaRole = 'slider';
  @HostBinding('attr.aria-valuemin') get ariaValueMin() {
    return this.min;
  }
  @HostBinding('attr.aria-valuemax') get ariaValueMax() {
    return this.max;
  }
  @HostBinding('attr.aria-valuenow') get ariaValueNow() {
    return this._currentValue;
  }
  position = 0;
  get percent() { return (this.position * 100) + '%'; }
  get pxValue() { return this.elRect ? this.position * this.elRect.width : 0; }
  private elRect = null;
  private _currentValue = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  /** Set the dimensions of the component and set the position to the current value */
  ngAfterViewInit() {
    this.setSliderDimensions();
    this.updatePosition(this.value);
    // need to notify of changes when modifying inside of AfterViewInit
    // https://github.com/angular/angular/issues/14748
    this.cdRef.detectChanges();
  }

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
    this.setSliderDimensions();
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
    e.stopPropagation();
    e.preventDefault();
  }

  /**
   * Remove the pressed status and update scrubber position when released
   * after dragging or clicking
   * @param e mousup event
   */
  @HostListener('document:mouseup', ['$event']) onRelease(e) {
    if (this.pressed) {
      this.pressed = false;
      this.updatePosition(this.value);
    }
  }

  @HostListener('touchstart', ['$event']) onTouchPress(e) {
    if (e.touches && e.touches.length === 1) {
      this.setSliderDimensions();
      this.setScrubberPosition(e.touches[0]);
      this.pressed = true;
    }
  }

  @HostListener('touchmove', ['$event']) onTouchMove(e) {
    if (this.pressed && e.touches && e.touches.length === 1) {
      this.setScrubberPosition(e.touches[0]);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  @HostListener('touchend', ['$event']) onTouchEnd(e) {
    if (this.pressed) {
      this.pressed = false;
      this.updatePosition(this.value);
    }
  }

  /** Move the scrubber left and right with arrow keys */
  @HostListener('keydown', ['$event']) onKeypress(e) {
    if ((e.keyCode === 37 || e.keyCode === 39)) {
      // left or right
      const newValue = (e.keyCode === 37) ?
        this.valueInRange(this.value - this.step) :
        this.valueInRange(this.value + this.step);
      if (newValue !== this.value) {
        this.valueChange.emit(newValue);
      }
    }
  }

  /** Gets the nearest step increment value to the provided value */
  getStepValue(val?: number): number {
    const step = 1 / this.step;
    if (!val) { val = ((this.max - this.min) * this.position + this.min); }
    return (Math.round((val * step)) / step);
  }

  /** Updates the position of the scrubber to the provided value if the scrubber is not pressed */
  updatePosition(val: number) {
    if (!this.pressed) {
      this.position = (val - this.min) / (this.max - this.min);
    }
  }

  /** Returns the value within the min / max range */
  private valueInRange(value) {
    return Math.min(this.max, Math.max(this.min, value));
  }

  /**
   * update the dimensions of the parent element
   */
  private setSliderDimensions() {
    this.elRect = this.el.nativeElement.getBoundingClientRect();
  }

  /**
   * Gets a value between 0 and 1 based on the element rectangle and screen offset
   * @param offset clientY (or pageY) position
   */
  private getVerticalValue(offset) {
      return Math.max(0,
        ((this.elRect.height - Math.abs(offset - this.elRect.top)) / this.elRect.height)
      );
  }

    /**
   * Gets a value between 0 and 1 based on the element rectangle and screen offset
   * @param offset clientX (or pageX) position
   */
  private getHorizontalValue(offset) {
    return Math.max(0, ((offset - this.elRect.left) / this.elRect.width));
  }

  /**
   * Set the scrubber position based on event values, but keep between 0 and 100
   * @param e the mouse event
   */
  private setScrubberPosition(e) {
    if (e.clientX && this.elRect) {
      const maxVal = this.getHorizontalValue(e.clientX);
      this.position = Math.min(1, maxVal);
      const newValue = this.getStepValue();
      if (newValue !== this.value) {
        this.valueChange.emit(newValue);
      }
    }
  }
}
