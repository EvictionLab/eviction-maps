import {
  Component, Input, Output, EventEmitter, HostListener, AfterViewInit, ViewChild
} from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements AfterViewInit {
  @Input()
  set activeMenuItem(value: string) {
    if (this.state.menuItem !== value) {
      this.state.menuItem = value;
      this.activeMenuItemChange.emit(value);
    }
  }
  get activeMenuItem() { return this.state.menuItem; }
  @Input() languageOptions;
  @Input() selectedLanguage;
  @Output() activeMenuItemChange = new EventEmitter();
  @Output() selectLocation = new EventEmitter();
  @Output() selectLanguage = new EventEmitter();
  @ViewChild('pop') mapTooltip;
  tooltipEnabled = true;
  private state = {
    menuItem: null
  };

  @HostListener('document:click', ['$event']) dismissTooltip() {
    this.mapTooltip.hide();
    this.tooltipEnabled = false;
  }

  ngAfterViewInit() {
    setTimeout(() => { this.mapTooltip.show(); }, 1000);
  }

  onMenuSelect(itemId: string) {
    this.activeMenuItem = this.activeMenuItem === itemId ? null : itemId;
  }

}
