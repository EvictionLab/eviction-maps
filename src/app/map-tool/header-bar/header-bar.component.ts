import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  @Input() languageOptions;
  @Output() selectMenuItem = new EventEmitter();
  @Output() selectLocation = new EventEmitter();
  @Output() selectLanguage = new EventEmitter();
  activeMenuItem: string;

  ngOnInit() {}

  onMenuSelect(itemId: string) {
    this.activeMenuItem = this.activeMenuItem === itemId ? null : itemId;
    this.selectMenuItem.emit(this.activeMenuItem);
  }

}
