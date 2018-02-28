import { Component, OnInit, Input, ViewChildren, Inject, QueryList } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DOCUMENT } from '@angular/common';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-ui-hint',
  templateUrl: './ui-hint.component.html',
  styleUrls: ['./ui-hint.component.scss']
})
export class UiHintComponent {
  @Input() hint: string;
  @Input() placement = 'top';
  @Input() triggers = 'hover focus';
  @Input() docHideTrigger = 'touchstart';
  @ViewChildren(TooltipDirective) tooltips: QueryList<TooltipDirective>;

  constructor(@Inject(DOCUMENT) private document: any) {}

  /**
   * Hide tooltip on first instance of document event while shown
   */
  onTooltipShown(event: any) {
    Observable.fromEvent(this.document, this.docHideTrigger)
      .take(1)
      .subscribe(e => this.tooltips.forEach(t => t.hide()));
  }
}
