import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class ToggleScrollService {
  set allowScroll(val: boolean) {
    this.document.body.style.overflowY = val ? null : 'hidden';
  }

  constructor(@Inject(DOCUMENT) private document: any) { }

}
