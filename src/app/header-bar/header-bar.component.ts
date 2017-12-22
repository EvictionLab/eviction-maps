import { Component, Input, Output, EventEmitter, HostListener, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements AfterViewInit {
  @Input() languageOptions;
  @Output() selectMenuItem = new EventEmitter();
  @Output() selectLocation = new EventEmitter();
  @Output() selectLanguage = new EventEmitter();
  @ViewChild('pop') mapTooltip;
  tooltipEnabled = true;
  activeMenuItem: string;

  @HostListener('document:click', ['$event']) dismissTooltip() {
    this.mapTooltip.hide();
    this.tooltipEnabled = false;
  } 
  
  ngAfterViewInit() {
    setTimeout(() => { this.mapTooltip.show(); }, 1000);
  }

  onMenuSelect(itemId: string) {
    this.activeMenuItem = this.activeMenuItem === itemId ? null : itemId;
    this.selectMenuItem.emit(this.activeMenuItem);
  }

}
