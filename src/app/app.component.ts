import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ViewContainerRef,
  Inject,
  HostListener,
  HostBinding,
  ComponentRef,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl
} from "@angular/platform-browser";
import { environment } from "../environments/environment";
import { Observable } from "rxjs/Observable";
import {
  TranslateService,
  TranslatePipe,
  TranslateDirective
} from "@ngx-translate/core";
import { Routes, Router, ActivatedRoute } from "@angular/router";
import { PageScrollService } from "ngx-page-scroll";

import { MapToolComponent } from "./map-tool/map-tool.component";
import { RankingToolComponent } from "./ranking/ranking-tool/ranking-tool.component";
import { EmbedComponent } from "./map-tool/embed/embed.component";
import { RankingConfig } from "./ranking/ranking.module";
import { MapFeature } from "./map-tool/map/map-feature";
import { ToastsManager } from "ng2-toastr";
import { PlatformService } from "./services/platform.service";
import { LoadingService } from "./services/loading.service";
import { AnalyticsService } from "./services/analytics.service";
import { RoutingService } from "./services/routing.service";
import { ScrollService } from "./services/scroll.service";
import { GraphEmbedComponent } from "./eviction-graphs/graph-embed/graph-embed.component";
import { CardEmbedComponent } from "./map-tool/location-cards/embed/card-embed.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [TranslatePipe]
})
export class AppComponent implements OnInit {
  mapComponent: MapToolComponent;
  @HostBinding("class.ranking-tool") isRankingTool: boolean;
  @HostBinding("class.map-tool") isMapTool: boolean;
  @HostBinding("class.embed") embed: boolean;
  @HostBinding("class.card-embed") cardEmbed: boolean;
  @HostBinding("class.ios") ios = false;
  @HostBinding("class.safari") safari = false;
  @HostBinding("class.ios-safari") iosSafari = false;
  @HostBinding("class.android") android = false;
  @HostBinding("class.ie") ie = false;
  @HostBinding("class.kiosk") kiosk = false;
  isLoading = false;
  currentMenuItem: string;
  menuActive = false;
  siteNav = environment.siteNav;
  footerNav = environment.footerNav;
  languageOptions = [
    { id: "en", name: "", langKey: "HEADER.EN" },
    { id: "es", name: "", langKey: "HEADER.ES" }
  ];
  selectedLanguage;
  isAtTop = true;
  activeComponentId: string;
  mapHeading = { title: "", sub: "" };
  private activeMenuItem;

  constructor(
    public loader: LoadingService,
    private platform: PlatformService,
    private translate: TranslateService,
    private translatePipe: TranslatePipe,
    private activatedRoute: ActivatedRoute,
    private routing: RoutingService,
    private router: Router,
    private toastr: ToastsManager,
    private vRef: ViewContainerRef,
    private titleService: Title,
    private el: ElementRef,
    private analytics: AnalyticsService,
    private pageScroll: PageScrollService,
    private scroll: ScrollService,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any
  ) {
    this.toastr.setRootViewContainerRef(vRef);
  }

  /** Sets the language and size relevant classes on init */
  ngOnInit() {
    const components = {
      map: MapToolComponent,
      cards: CardEmbedComponent,
      rankings: RankingToolComponent,
      embed: EmbedComponent,
      graph: GraphEmbedComponent,
      kiosk: MapToolComponent
    };
    this.loader.isLoading$.subscribe(loading => {
      this.isLoading = loading;
      this.cd.detectChanges();
    });
    this.routing.setupRoutes(components);
    this.kiosk = this.routing.kiosk;
    this.scroll.setupScroll(this.pageScroll);
    this.scroll.scrolledToTop$.subscribe(top => (this.isAtTop = top));
    this.translate.setDefaultLang("en");
    this.translate.use("en");
    this.translate.onLangChange.subscribe(lang => {
      this.updateLanguage(lang.translations);
    });
    // Add user agent-specific classes
    this.ios = this.platform.isIos;
    this.safari = this.platform.isSafari;
    this.iosSafari = this.platform.isIosSafari;
    this.android = this.platform.isAndroid;
    this.ie = this.platform.isIE;
  }

  closeMenu() {
    this.currentMenuItem = null;
    this.menuActive = false;
  }

  getTitleFromMapState(state) {
    const stat1 = this.translatePipe.transform(state.bubble.langKey);
    const stat2 = this.translatePipe.transform(state.choro.langKey);
    const region = this.translatePipe.transform(state.region.langKey);
    const notNone = [state.bubble, state.choro].filter(
      stat => stat.id !== "none"
    );
    const title =
      notNone.length > 1
        ? this.translatePipe.transform("HEADER.MAP_TITLE", {
            stat1,
            stat2
          })
        : this.translatePipe.transform(notNone[0].langKey);
    const sub = this.translatePipe.transform("HEADER.MAP_SUBTITLE", {
      region,
      year: state.year
    });
    this.mapHeading = { title, sub };
  }

  /** Fired when a route is activated */
  onActivate(component: any) {
    this.activeComponentId = component.id;
    let title;
    if (component.id === "map-tool") {
      this.mapComponent = component;
      title = this.translatePipe.transform("MAP.TITLE");
      this.mapComponent.mapToolService.state.subscribe(state => {
        this.getTitleFromMapState(state);
      });
    } else if (component.id === "ranking-tool") {
      title = this.translatePipe.transform("RANKINGS.TITLE");
    }
    // Only set title if not empty
    if (title) {
      this.titleService.setTitle(title);
    }
    this.updateClassAttributes(component.id);
    const loadedData = {
      siteVersion: this.platform.deviceType,
      appVersion: environment.appVersion,
      timeStamp: Date.now(),
      pageCategory: component.id,
      language: this.translate.currentLang
    };
    this.analytics.trackEvent("dataLayer-loaded", loadedData);
  }

  /** Sets the attribute properties that determine the root class for the active component */
  updateClassAttributes(id: string) {
    this.isRankingTool = id === "ranking-tool";
    this.isMapTool = id === "map-tool";
    this.embed =
      id === "embed-map" || id === "embed-graph" || id === "card-embed";
    this.cardEmbed = id === "card-embed";
  }

  onMenuSelect(itemId: string) {
    this.currentMenuItem = itemId;
    if (itemId === "menu") {
      this.platform.saveActiveElement();
      this.menuActive = true;
    }
    // scroll to top when map is selected
    if (itemId === "data") {
      if (this.mapComponent) {
        this.mapComponent.goToTop();
      }
    }
    // set the active menu item in the component so it knows
    if (this.mapComponent) {
      this.mapComponent.activeMenuItem = itemId;
    }
  }

  /**
   * Set the language to use in the translate service
   * TODO: Make sure the route parameter is updated when changed
   */
  onLanguageSelect(lang) {
    if (this.translate.currentLang === lang.id) {
      return;
    }
    this.translate.use(lang.id);
    this.analytics.trackEvent("languageSelection", { language: lang.id });
  }

  /**
   * Forward search select to the component
   */
  onSearchSelect(searchData: any) {
    // track search selection
    if (searchData && searchData.feature && searchData.queryTerm) {
      const selectedEvent = {
        locationSelected: searchData.feature.properties.label,
        locatonSelectedLevel: searchData.feature.properties.layerId,
        locationFindingMethod: "search",
        combinedSelections: this.mapComponent.mapToolService.getCurrentDataString()
      };
      this.analytics.trackEvent("locationSelection", selectedEvent);
      const searchEvent = {
        locationSearchTerm: searchData.queryTerm,
        ...selectedEvent
      };
      this.analytics.trackEvent("searchSelection", searchEvent);
    }
    // forward to map component
    return this.mapComponent.onSearchSelect.apply(this.mapComponent, arguments);
  }

  /**
   * Forward initial search event to map tool component
   */
  onInitialSearchInput() {
    this.mapComponent.onInitialSearchInput.apply(this.mapComponent, arguments);
  }

  /** Updates the URLs and link names for site navigation */
  private updateNavigationLanguage(translations) {
    const lang = this.translate.currentLang;
    this.siteNav = this.siteNav.map(l => {
      if (l.langKey) {
        l["name"] = translations[l.langKey.split(".")[1]];
      }
      l["url"] =
        l["langUrls"] && l["langUrls"].hasOwnProperty(lang)
          ? l["langUrls"][lang]
          : l["defaultUrl"];
      return l;
    });
    this.footerNav = this.footerNav.map(l => {
      if (l.langKey) {
        l["name"] = translations[l.langKey.split(".")[1]];
      }
      l["url"] =
        l["langUrls"] && l["langUrls"].hasOwnProperty(lang)
          ? l["langUrls"][lang]
          : l["defaultUrl"];
      return l;
    });
  }

  /**
   * Update the lang attribute on the html element
   * Based on https://github.com/ngx-translate/core/issues/565
   */
  private updateLanguage(translations) {
    // update html lang attribute
    const lang = this.document.createAttribute("lang");
    lang.value = this.translate.currentLang;
    this.el.nativeElement.parentElement.parentElement.attributes.setNamedItem(
      lang
    );
    // update item in dropdown
    this.selectedLanguage = this.languageOptions.filter(
      l => l.id === this.translate.currentLang
    )[0];
    // update language options to new language
    if (translations.hasOwnProperty("HEADER")) {
      const header = translations["HEADER"];
      this.languageOptions = this.languageOptions.map(l => {
        if (l.langKey) {
          l.name = header[l.langKey.split(".")[1]];
        }
        return l;
      });
    }
    // update site navigation language
    if (translations.hasOwnProperty("NAV")) {
      this.updateNavigationLanguage(translations["NAV"]);
    }
  }
}
