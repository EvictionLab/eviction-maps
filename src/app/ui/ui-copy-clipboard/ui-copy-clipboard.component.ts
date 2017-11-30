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
  private clipboard;

  ngAfterViewInit() {
    this.clipboard = new Clipboard(this.button.nativeElement, {
      target: (t) => this.input.nativeElement
    });
  }

}
