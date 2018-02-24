import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-ui-icon',
  templateUrl: './ui-icon.component.html',
  styleUrls: ['./ui-icon.component.scss']
})
export class UiIconComponent {
  @HostBinding('class.icon') iconClass = true;
  @Input() icon: string;
}
