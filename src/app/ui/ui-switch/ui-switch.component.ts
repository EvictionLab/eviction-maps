import {
  Component, HostBinding, HostListener, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-ui-switch',
  templateUrl: './ui-switch.component.html',
  styleUrls: ['./ui-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSwitchComponent {

  @HostBinding('class.on') isOn = false;
  @Input()
  set on(value) {
    if (value === this.isOn) { return; }
    this.isOn = value;
    this.switched.emit(value);
  }
  get on() { return this.isOn; }
  @Input() leftLabel: string;
  @Input() rightLabel: string;
  @Output() switched = new EventEmitter<boolean>();
  @HostBinding('attr.role') ariaRole = 'switch';
  @HostBinding('attr.aria-checked') get ariaChecked() {
    return this.isOn;
  }
  @HostBinding('attr.aria-label') get ariaLabel() {
    return this.rightLabel;
  }
  private touch = {
    x: null,
    y: null,
    time: null
  };

  /** Track touch position and time on touch start */
  @HostListener('touchstart', ['$event']) onTouchStart(e) {
    const touchobj = e.changedTouches[0];
    this.touch.x = touchobj.pageX;
    this.touch.y = touchobj.pageY;
    this.touch.time = new Date().getTime();
  }

  /** Check is the touch event was a swipe and switch in the appropriate direction */
  @HostListener('touchend', ['$event']) onTouchEnd(e) {
    const touchobj = e.changedTouches[0];
    const elapsedTime = new Date().getTime() - this.touch.time;
    const distX = Math.abs(touchobj.pageX - this.touch.x);
    const distY = Math.abs(touchobj.pageY - this.touch.y);
    const isSwipe = (elapsedTime <= 1600 && distX >= 56 && distX > distY);
    if (isSwipe) {
      this.on = (touchobj.pageX > this.touch.x);
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    const keys = { 'SPACE': 32, 'ENTER': 13, 'UP': 38, 'DOWN': 40, 'ESC': 27 };
    if (e.keyCode === keys['SPACE'] || e.keyCode === keys['ENTER']) {
      this.on = !this.on;
      e.preventDefault();
      e.stopPropagation();
    }
  }

}
