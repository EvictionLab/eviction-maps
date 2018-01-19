import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ui-hint',
  templateUrl: './ui-hint.component.html',
  styleUrls: ['./ui-hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiHintComponent {
  @Input() hint: string;
  @Input() placement = 'top';
  @Input() triggers = 'hover focus';
}
