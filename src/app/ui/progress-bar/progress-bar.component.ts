import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  // Shows indeterminate progress bar when true
  @Input() indeterminate: boolean;
  // Shows progress bar corresponding to provided number (between 0 and 1)
  @Input() progress: number;
  // Get percent value of current progress
  get percent(): string { return (this.progress * 100) + '%'; }
  // Hide when no progress or indeterminate is not set
  @HostBinding('style.display') get visible() {
    return (this.indeterminate || this.progress) ? 'block' : 'none';
  }
  // Accessibility attributes
  @HostBinding('attr.role') ariaRole = 'progressbar';
  @HostBinding('attr.aria-valuetext') get ariaValueText() {
    return this.indeterminate ? 'Loading' : null;
  }
  @HostBinding('attr.aria-valuemin') get ariaMin() {
    return this.progress ? 0 : null;
  }
  @HostBinding('attr.aria-valuemax') get ariaMax() {
    return this.progress ? 100 : null;
  }
  @HostBinding('attr.aria-valuenow') get ariaValue() {
    return this.progress;
  }

}
