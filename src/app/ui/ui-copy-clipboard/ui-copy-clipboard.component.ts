import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Clipboard from 'clipboard';

@Component({
  selector: 'app-ui-copy-clipboard',
  templateUrl: './ui-copy-clipboard.component.html',
  styleUrls: ['./ui-copy-clipboard.component.scss']
})
export class UiCopyClipboardComponent implements AfterViewInit {
  @Input() hintText: string;
  @Input() copyText: string;
  @ViewChild('btn') button: ElementRef;
  @ViewChild('textInput') input: ElementRef;
  @ViewChild('pop') tooltip;
  private clipboard;
  private timeout;

  ngAfterViewInit() {
    this.clipboard = new Clipboard(this.button.nativeElement, {
      target: (t) => this.input.nativeElement
    });
    this.clipboard.on('success', () => {
      // Clear existing timeout if exists
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.tooltip.show();
      this.timeout = setTimeout(() => this.tooltip.hide(), 2000);
    });
  }

}
