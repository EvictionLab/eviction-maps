import {
  Component, Input, Output, EventEmitter, HostListener, OnInit, AfterViewInit, ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

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
  @Input() languageOptions = [];
  @Input() activeComponentId: string;

  @Output() activeMenuItemChange = new EventEmitter();
  @Output() selectLocation = new EventEmitter();
  @Output() initialInput = new EventEmitter();
  @Output() selectLanguage = new EventEmitter();
  @ViewChild('pop') mapTooltip;
  tooltipEnabled = true;
  deployUrl = environment.deployUrl;
  private state = { menuItem: null };
  get selectedLanguage() {
    return this.languageOptions.filter(l => l.id === this.translate.currentLang)[0];
  }

  constructor(private translate: TranslateService) {}

  ngOnInit() {}

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



}
