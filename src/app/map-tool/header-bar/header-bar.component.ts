import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent {
  @Output() selectMenuItem = new EventEmitter();
  @Output() selectLocation = new EventEmitter();
  activeMenuItem: string;

  constructor() { }

  onMenuSelect(itemId: string) {
    this.activeMenuItem = this.activeMenuItem === itemId ? null : itemId;
    this.selectMenuItem.emit(this.activeMenuItem);
  }

}
