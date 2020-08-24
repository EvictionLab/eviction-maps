import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  Inject,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../environments/environment";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-header-bar",
  templateUrl: "./header-bar.component.html",
  styleUrls: ["./header-bar.component.scss"]
})
export class HeaderBarComponent implements OnInit {
  @Input()
  set activeMenuItem(value: string) {
    if (this.state.menuItem !== value) {
      this.state.menuItem = value;
      this.activeMenuItemChange.emit(value);
    }
  }
  get activeMenuItem() {
    return this.state.menuItem;
  }
  @Input() mapHeading = { title: "", sub: "" };
  @Input() languageOptions = [];
  @Input() activeComponentId: string;
  @Output() activeMenuItemChange = new EventEmitter();
  @Output() selectLocation = new EventEmitter();
  @Output() initialInput = new EventEmitter();
  @Output() selectLanguage = new EventEmitter();
  // @ViewChild("pop") mapTooltip;
  tooltipEnabled = true;
  deployUrl = environment.deployUrl;
  lang = {};
  private state = { menuItem: null };
  get selectedLanguage() {
    return this.languageOptions.filter(
      l => l.id === this.translate.currentLang
    )[0];
  }

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.translate.onLangChange.subscribe(lang => {
      this.lang = lang.translations["HEADER"];
    });
  }

  /**
   * Checks for clicks outside of the active control
   * and deactivates the control if needed (mobile only)
   * @param e
   */
  @HostListener("document:click", ["$event"]) closeActiveOverlay(e) {
    // deactivate search if click outside active element
    if (this.activeMenuItem === "search") {
      const el = this.document.getElementsByClassName("header__search");
      if (el.length && !el[0].contains(e.target)) {
        this.activeMenuItem = null;
      }
    }
    // deactivate data selection if click outside of panel / button
    if (this.activeMenuItem === "data") {
      const el = this.document.getElementsByClassName("map-ui")[0];
      const el2 = this.document.getElementsByClassName("header__data-btn")[0];
      if (!el.contains(e.target) && !el2.contains(e.target)) {
        this.activeMenuItem = null;
      }
    }
  }

  onMenuSelect(itemId: string) {
    this.activeMenuItem = this.activeMenuItem === itemId ? null : itemId;
  }
}
