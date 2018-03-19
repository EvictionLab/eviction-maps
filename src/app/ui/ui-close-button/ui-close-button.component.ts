import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ui-close-button',
  templateUrl: './ui-close-button.component.html',
  styleUrls: ['./ui-close-button.component.scss'],
  providers: [ TranslatePipe ]
})
export class UiCloseButtonComponent implements OnInit {
  @Input() label;
  @Input() ariaLabel;
  @Output() onPress = new EventEmitter();

  constructor(private translatePipe: TranslatePipe) {}

  ngOnInit() {
    if (!this.ariaLabel) {
      this.ariaLabel = this.translatePipe.transform('DATA.CLOSE_BUTTON');
    }
  }
}
