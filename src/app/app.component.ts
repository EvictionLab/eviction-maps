import {
  Component, OnInit, ViewChild, ViewContainerRef, Inject, HostListener, HostBinding, ComponentRef
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { PlatformService } from './platform.service';
import { TranslateService, TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Routes, Router } from '@angular/router';
import { MapToolComponent } from './map-tool/map-tool.component';
import { RankingToolComponent } from './ranking/ranking-tool/ranking-tool.component';
import { RankingConfig } from './ranking/ranking.module';
import { DataService } from './data/data.service';
import { MapFeature } from './map-tool/map/map-feature';
import { ToastsManager } from 'ng2-toastr';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mapComponent: MapToolComponent;
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
    public dataService: DataService,
    public loader: LoadingService,
    private platform: PlatformService,
    private translate: TranslateService,
    private router: Router,
    private toastr: ToastsManager,
    private vRef: ViewContainerRef,
    private titleService: Title
  ) {
      this.toastr.setRootViewContainerRef(vRef);
  }

  /** Sets the language and size relevant classes on init */
  ngOnInit() {
    this.setupRoutes();
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.onWindowResize();
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
    if (component.constructor.name === 'MapToolComponent') {
      this.mapComponent = component;
      this.titleService.setTitle('Eviction Lab - Map & Data'); // TODO: translate
    } else if (component.constructor.name === 'RankingToolComponent') {
      this.titleService.setTitle('Eviction Lab - Eviction Rankings'); // TODO: translate
    }
  }

  onMenuSelect(itemId: string) {
    this.currentMenuItem = itemId;
    if (itemId === 'menu') {
      this.menuActive = true;
    }
    if (this.mapComponent) {
      this.mapComponent.activeMenuItem = itemId;
    }
  }

  onLanguageSelect(lang) {
    this.translate.use(lang.id);
  }

 /**
   * Forward search select to the component
   */
  onSearchSelect(...args: any[]) {
    return this.mapComponent.onSearchSelect.apply(this.mapComponent, arguments);
  }

  /**
   * Route Configuration
   * Both evictionlab.org/map and evictionlab.org/rankings point to this app.
   * - `evictionlab.org/map`: redirects to default map view
   * - `evictionlab.org/rankings`: redirects to default eviction rankings view
   * - `evictionlab.org/rankings/#/evictions`: redirects to default eviction rankings view
   * - `evictionlab.org/rankings/#/evictors`: redirects to default top evictors view
   */
  setupRoutes() {
    const defaultMapData = {
      mapConfig: {
        style: './assets/style.json',
        center: [-98.5795, 39.8283],
        zoom: 3,
        minZoom: 2,
        maxZoom: 14
      },
      year: 2016
    };
    const defaultViews = {
      map: '/2016/auto/-136.80,20.68,-57.60,52.06',
      rankings: '/evictions/United%20States/0/evictionRate',
      evictors: '/evictors'
    };
    const defaultRoute = window.location.pathname.includes('rankings') ?
      defaultViews.rankings : defaultViews.map;
    const appRoutes: Routes = [
      {
        path: ':year/:geography/:bounds',
        component: MapToolComponent,
        data: defaultMapData
      },
      {
        path: 'evictors',
        component: RankingToolComponent
      },
      {
        path: 'evictions/:region/:areaType/:sortProp',
        component: RankingToolComponent
      },
      {
        path: 'evictions/:region/:areaType/:sortProp/:location',
        component: RankingToolComponent
      },
      {
        path: 'evictions',
        redirectTo: defaultViews.rankings
      },
      {
        path: '',
        redirectTo: defaultRoute, // default route based on the URL path
        pathMatch: 'full'
      }
    ];
    // reset router with dynamic routes
    this.router.resetConfig(appRoutes);
  }

  /** Sets the booleans that determine the classes on the app component */
  @HostListener('window:resize') onWindowResize() {
    this.largerThanMobile = this.platform.isLargerThanMobile;
    this.largerThanTablet = this.platform.isLargerThanTablet;
    this.largerThanSmallDesktop = this.platform.isLargerThanSmallDesktop;
    this.largerThanLargeDesktop = this.platform.isLargerThanLargeDesktop;
  }
}
