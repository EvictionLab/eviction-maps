import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ui-hint',
  templateUrl: './ui-hint.component.html',
  styleUrls: ['./ui-hint.component.scss']
})
export class UiHintComponent {
  @Input() hint: string;
  @Input() placement = 'top';
  @Input() triggers = 'focus';
}
