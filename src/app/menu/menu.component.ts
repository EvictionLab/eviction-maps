import {
  Component, OnInit, EventEmitter, Output, HostListener, Input, HostBinding, ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  @Input() expanded = false;
  @Output() onClose = new EventEmitter();
  @HostBinding('class.expanded') get isOpen() { return this.expanded; }

  constructor() { }

  /** Stop clicks in the menu from bubbling up to document */
  @HostListener('mousedown', ['$event']) onclick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  /** Close the menu when the user clicks outside of it */
  @HostListener('document:mousedown') onDocClick() {
    if (this.isOpen) {
      this.onClose.emit();
    }
  }

}
