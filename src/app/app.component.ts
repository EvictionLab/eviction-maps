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
import { Routes, Router } from '@angular/router';
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
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mapComponent: MapToolComponent;
  @HostBinding('class.ranking-tool') isRankingTool: boolean;
  @HostBinding('class.map-tool') isMapTool: boolean;
  @HostBinding('class.embed') embed: boolean;
  @HostBinding('class.gt-mobile') largerThanMobile: boolean;
  @HostBinding('class.gt-tablet') largerThanTablet: boolean;
  @HostBinding('class.gt-small-desktop') largerThanSmallDesktop: boolean;
  @HostBinding('class.gt-large-desktop') largerThanLargeDesktop: boolean;
  @HostBinding('class.ios-safari') iosSafari = false;
  @HostBinding('class.android') android = false;
  currentMenuItem: string;
  menuActive = false;
  private activeMenuItem;

  constructor(
    public loader: LoadingService,
    private platform: PlatformService,
    private translate: TranslateService,
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
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.translate.onLangChange.subscribe((e) => this.updateHtmlLanguage());
    this.onWindowResize();
    // TODO: move to platform service
    // Add user agent-specific classes
    const userAgent = navigator.userAgent.toLowerCase();
    this.iosSafari = ((userAgent.includes('iphone') || userAgent.includes('ipad')) &&
      (!userAgent.includes('crios') && !userAgent.includes('fxios')));
    this.android = userAgent.includes('android') && !userAgent.includes('firefox');
  }

  closeMenu() {
    this.currentMenuItem = null;
    this.menuActive = false;
  }

  /** Fired when a route is activated */
  onActivate(component: any) {
    if (component.id === 'map-tool') {
      this.mapComponent = component;
      this.titleService.setTitle('Eviction Lab - Map & Data'); // TODO: translate
    } else if (component.id === 'ranking-tool') {
      this.titleService.setTitle('Eviction Lab - Eviction Rankings'); // TODO: translate
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
    this.largerThanLargeDesktop = this.platform.isLargerThanLargeDesktop;
  }

  /**
   * Update the lang attribute on the html element
   * Based on https://github.com/ngx-translate/core/issues/565
   */
  private updateHtmlLanguage() {
    const lang = this.document.createAttribute('lang');
    lang.value = this.translate.currentLang;
    this.el.nativeElement.parentElement.parentElement.attributes.setNamedItem(lang);
  }
}
