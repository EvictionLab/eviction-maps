import {
  Component, Input, Output, EventEmitter, HostListener, OnInit, AfterViewInit, ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit, AfterViewInit {
  @Input()
  set activeMenuItem(value: string) {
    if (this.state.menuItem !== value) {
      this.state.menuItem = value;
      this.activeMenuItemChange.emit(value);
    }
  }
  get activeMenuItem() { return this.state.menuItem; }

  @Output() activeMenuItemChange = new EventEmitter();
  @Output() selectLocation = new EventEmitter();
  @Output() selectLanguage = new EventEmitter();
  @ViewChild('pop') mapTooltip;
  languageOptions = [
    { id: 'en', name: '', langKey: 'HEADER.EN' },
    { id: 'es', name: '', langKey: 'HEADER.ES' }
  ];
  tooltipEnabled = true;
  private state = { menuItem: null };
  get selectedLanguage() {
    return this.languageOptions.filter(l => l.id === this.translate.currentLang)[0];
  }

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.onLangChange.subscribe((lang) => {
      this.updateLanguage(lang.translations);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => { this.mapTooltip.show(); }, 1000);
  }

  @HostListener('document:click', ['$event']) dismissTooltip() {
    this.mapTooltip.hide();
    this.tooltipEnabled = false;
  }

  onMenuSelect(itemId: string) {
    this.activeMenuItem = this.activeMenuItem === itemId ? null : itemId;
  }

  private updateLanguage(translations) {
    if (translations.hasOwnProperty('HEADER')) {
      const header = translations['HEADER'];
      this.languageOptions = this.languageOptions.map(l => {
        if (l.langKey) { l.name = header[ l.langKey.split('.')[1] ]; }
        return l;
      });
    }
  }

}
