import {
  Component, OnInit, ViewChild, ViewContainerRef, Inject, HostListener, HostBinding, ComponentRef,
  ElementRef
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { PageScrollService } from 'ng2-page-scroll';

import { MapToolComponent } from './map-tool/map-tool.component';
import { RankingToolComponent } from './ranking/ranking-tool/ranking-tool.component';
import { EmbedComponent } from './map-tool/embed/embed.component';
import { RankingConfig } from './ranking/ranking.module';
import { MapFeature } from './map-tool/map/map-feature';
import { ToastsManager } from 'ng2-toastr';
import { PlatformService } from './services/platform.service';
import { LoadingService } from './services/loading.service';
import { AnalyticsService } from './services/analytics.service';
import { RoutingService } from './services/routing.service';
import { ScrollService } from './services/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ TranslatePipe ]
})
export class AppComponent implements OnInit {
  mapComponent: MapToolComponent;
  @HostBinding('class.ranking-tool') isRankingTool: boolean;
  @HostBinding('class.map-tool') isMapTool: boolean;
  @HostBinding('class.embed') embed: boolean;
  @HostBinding('class.gt-mobile') largerThanMobile: boolean;
  @HostBinding('class.gt-tablet') largerThanTablet: boolean;
  @HostBinding('class.gt-laptop') largerThanSmallDesktop: boolean;
  @HostBinding('class.ios-safari') iosSafari = false;
  @HostBinding('class.android') android = false;
  currentMenuItem: string;
  menuActive = false;
  siteNav = [
    { url: 'https://evictionlab.org/', langKey: 'NAV.HOME' },
    { url: 'https://evictionlab.org/map', langKey: 'NAV.MAP' },
    { url: 'https://evictionlab.org/eviction-rankings', langKey: 'NAV.RANKINGS' },
    { url: 'https://evictionlab.org/about-eviction-lab', langKey: 'NAV.ABOUT' },
    { url: 'https://evictionlab.org/the-problem', langKey: 'NAV.PROBLEM' },
    { url: 'https://evictionlab.org/our-methodology', langKey: 'NAV.METHODS' },
    { url: 'https://evictionlab.org/help-faq', langKey: 'NAV.HELP' },
    { url: 'https://evictionlab.org/updates', langKey: 'NAV.UPDATES' }
  ];
  languageOptions = [
    { id: 'en', name: '', langKey: 'HEADER.EN' },
    { id: 'es', name: '', langKey: 'HEADER.ES' }
  ];
  selectedLanguage;
  isAtTop = true;
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
    @Inject(DOCUMENT) private document: any
  ) {
      this.toastr.setRootViewContainerRef(vRef);
  }

  /** Sets the language and size relevant classes on init */
  ngOnInit() {
    const components = {
      map: MapToolComponent,
      rankings: RankingToolComponent,
      embed: EmbedComponent
    };
    this.routing.setupRoutes(components);
    this.scroll.setupScroll(this.pageScroll);
    this.scroll.scrolledToTop$.subscribe(top => this.isAtTop = top);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.translate.onLangChange.subscribe((lang) => {
      this.updateLanguage(lang.translations);
    });
    this.onWindowResize();
    // Add user agent-specific classes
    this.iosSafari = this.platform.isIosSafari;
    this.android = this.platform.isAndroid;
  }

  closeMenu() {
    this.currentMenuItem = null;
    this.menuActive = false;
  }

  /** Fired when a route is activated */
  onActivate(component: any) {
    if (component.id === 'map-tool') {
      this.mapComponent = component;
      this.titleService.setTitle(this.translatePipe.transform('MAP.TITLE'));
    } else if (component.id === 'ranking-tool') {
      this.titleService.setTitle(this.translatePipe.transform('RANKINGS.TITLE'));
    }
    this.updateClassAttributes(component.id);
    const loadedData = {
      'siteVersion': this.platform.deviceType,
      'appVersion': environment.appVersion,
      'timeStamp': Date.now(),
      'pageCategory': component.id,
      'language': this.translate.currentLang,
    };
    this.analytics.trackEvent('dataLayer-loaded', loadedData);
  }

  /** Sets the attribute properties that determine the root class for the active component */
  updateClassAttributes(id: string) {
    this.isRankingTool = (id === 'ranking-tool');
    this.isMapTool = (id === 'map-tool');
    this.embed = (id === 'embed-map');
  }

  onMenuSelect(itemId: string) {
    this.currentMenuItem = itemId;
    if (itemId === 'menu') {
      this.menuActive = true;
    }
    // scroll to top when map is selected
    if (itemId === 'map') {
      if (this.mapComponent) { this.mapComponent.goToTop(); }
    }
    // show help dialog when help is pressed
    if (itemId === 'help') {
      if (this.mapComponent) {
        this.mapComponent.showHelpDialog()
          .subscribe((res) => { this.onMenuSelect(null); });
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
    this.translate.use(lang.id);
    this.analytics.trackEvent('languageSelection', { language: lang.id });
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
        locationFindingMethod: 'search',
        combinedSelections: this.mapComponent.mapToolService.getCurrentDataString()
      };
      this.analytics.trackEvent('locationSelection', selectedEvent);
      const searchEvent = { locationSearchTerm: searchData.queryTerm, ...selectedEvent };
      this.analytics.trackEvent('searchSelection', searchEvent);
    }
    // forward to map component
    return this.mapComponent.onSearchSelect.apply(this.mapComponent, arguments);
  }

  /** Sets the booleans that determine the classes on the app component */
  @HostListener('window:resize') onWindowResize() {
    this.largerThanMobile = this.platform.isLargerThanMobile;
    this.largerThanTablet = this.platform.isLargerThanTablet;
    this.largerThanSmallDesktop = this.platform.isLargerThanSmallDesktop;
  }

  /**
   * Update the lang attribute on the html element
   * Based on https://github.com/ngx-translate/core/issues/565
   */
  private updateLanguage(translations) {
    // update html lang attribute
    const lang = this.document.createAttribute('lang');
    lang.value = this.translate.currentLang;
    this.el.nativeElement.parentElement.parentElement.attributes.setNamedItem(lang);
    // update item in dropdown
    this.selectedLanguage =
      this.languageOptions.filter(l => l.id === this.translate.currentLang)[0];
    // update language options to new language
    if (translations.hasOwnProperty('HEADER')) {
      const header = translations['HEADER'];
      this.languageOptions = this.languageOptions.map(l => {
        if (l.langKey) { l.name = header[ l.langKey.split('.')[1] ]; }
        return l;
      });
    }
    // update site navigation language
    if (translations.hasOwnProperty('NAV')) {
      const nav = translations['NAV'];
      this.siteNav = this.siteNav.map(l => {
        if (l.langKey) { l['name'] = nav[ l.langKey.split('.')[1] ]; }
        return l;
      });
    }
  }
}
