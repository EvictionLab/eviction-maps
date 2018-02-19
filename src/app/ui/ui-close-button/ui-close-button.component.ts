import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-ui-close-button',
  templateUrl: './ui-close-button.component.html',
  styleUrls: ['./ui-close-button.component.scss']
})
export class UiCloseButtonComponent {
  @Input() label;
  @Output() onPress = new EventEmitter();
}
