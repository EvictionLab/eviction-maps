import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  AfterViewInit
} from "@angular/core";

@Component({
  selector: "app-guide-step",
  templateUrl: "./guide-step.component.html",
  styleUrls: ["./guide-step.component.scss"]
})
export class GuideStepComponent implements AfterViewInit {
  /** Title of the guide step */
  @Input() title: string;

  /** HTML content or text string for step content */
  @Input() content: string;

  /** Current step number of the current guide */
  @Input() step: number;

  /** Total number of steps in this guide */
  @Input() total: number;

  /** Horizontal alignment of guide step */
  private _hAlign: string;
  @Input() set hAlign(value: string) {
    if (this._hAlign === value) return;
    this._hAlign = value;
    this.setArrowClass();
  }
  get hAlign() {
    return this._hAlign;
  }

  /** Vertical alignment of guide step */
  private _vAlign: string;
  @Input() set vAlign(value: string) {
    if (this._vAlign === value) return;
    this._vAlign = value;
    this.setArrowClass();
  }
  get vAlign() {
    return this._vAlign;
  }

  /** X offset for guide step */
  private _x: number;
  @Input() set x(value: number) {
    if (this._x === value) return;
    this._x = value;
    this.setPosition();
  }
  get x() {
    return this._x;
  }

  /** Y offset for guide step */
  private _y: number;
  @Input() set y(value: number) {
    if (this._y === value) return;
    this._y = value;
    this.setPosition();
  }
  get y() {
    return this._y;
  }

  /** Emitter for "continue" button */
  @Output() onNext: EventEmitter<any> = new EventEmitter();

  /** Emitter for "previous" button */
  @Output() onPrevious: EventEmitter<any> = new EventEmitter();

  /** Emitter for "stop guide" button */
  @Output() onStop: EventEmitter<any> = new EventEmitter();

  /** Emitter for when guide step is dismissed */
  @Output() onDismiss: EventEmitter<any> = new EventEmitter();

  /** Emitter for when guide is completed */
  @Output() onEnd: EventEmitter<any> = new EventEmitter();

  /** Emitter for when the guide step is present in the DOM */
  @Output() onStepReady: EventEmitter<any> = new EventEmitter();

  /** Bind `.guide-step` class to host element */
  @HostBinding("class.guide-step") defaultClass = true;

  /** Class bindings for arrow positions */
  @HostBinding("class.arrow--top") arrowTop;
  @HostBinding("class.arrow--bottom") arrowBottom;
  @HostBinding("class.arrow--left") arrowLeft;
  @HostBinding("class.arrow--right") arrowRight;

  /** CSS transform for step positioning */
  @HostBinding("style.transform")
  transform = `translate(${this.x}px, ${this.y}px)`;
  constructor(public el: ElementRef) {}

  ngAfterViewInit() {
    this.onStepReady.emit(this.el);
  }

  setPosition() {
    this.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  setArrowClass() {
    this.arrowLeft = this.hAlign === "left";
    this.arrowRight = this.hAlign === "right";
    this.arrowTop = this.vAlign === "bottom";
    this.arrowBottom = this.vAlign === "top";
  }
}
