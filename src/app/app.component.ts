import { Component, OnInit, ViewChild, Inject, HostListener, HostBinding } from '@angular/core';
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
import { UiToastComponent } from './ui/ui-toast/ui-toast.component';
import { MapFeature } from './map-tool/map/map-feature';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(UiToastComponent) toast;
  @HostBinding('class.gt-mobile') largerThanMobile: boolean;
  @HostBinding('class.gt-tablet') largerThanTablet: boolean;
  @HostBinding('class.gt-small-desktop') largerThanSmallDesktop: boolean;
  @HostBinding('class.gt-large-desktop') largerThanLargeDesktop: boolean;
  private activeMenuItem;

  constructor(
    private platform: PlatformService,
    private translate: TranslateService,
    private router: Router,
    private dataService: DataService
  ) { }

  /** Sets the language and size relevant classes on init */
  ngOnInit() { 
    this.setupRoutes();
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.onWindowResize(); 
  }


  onMenuSelect(itemId: string) {
    this.activeMenuItem = itemId;
  }

  onLanguageSelect(lang) {
    this.translate.use(lang.id);
  }

 /**
   * Sets auto changing of layers to false, and zooms the map the selected features
   * @param feature map feature returned from select
   * @param updateMap moves the map to the selected location if true
   */
  onSearchSelect(feature: MapFeature | null, updateMap = true) {
    // this.autoSwitchLayers = false;
    if (feature) {
      this.dataService.isLoading = true;
      const layerId = feature.properties['layerId'];
      this.dataService.getTileData(
        layerId, feature.geometry['coordinates'], feature.properties['name'], true
      ).subscribe(data => {
          if (!data.properties.n) {
            this.toast.display('Could not find data for location.');
          } else {
            this.dataService.addLocation(data);
          }
          this.dataService.activeDataLevel = this.dataService.dataLevels.filter(l => l.id === layerId)[0];
          if (updateMap) {
            if (feature.hasOwnProperty('bbox')) {
              this.dataService.mapView = feature['bbox'];
            }
          }
          // this.router.navigate(this.dataService.getRouteArray(), { replaceUrl: true });
          //   // Wait for map to be done loading, then set data layer
          //   this.map.map.isLoading$.distinctUntilChanged()
          //     .debounceTime(500)
          //     .filter(state => !state)
          //     .first()
          //     .subscribe((state) => this.map.setGroupVisibility(dataLevel));
          // }
          this.dataService.isLoading = false;
        });
    }
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
        minZoom: 3,
        maxZoom: 14
      },
      year: 2016
    };
    const defaultViews = {
      map: '/none/2016/auto/none/none/-136.80,20.68,-57.60,52.06',
      rankings: '/evictions/all/cities/eviction-rate',
      evictors: '/evictors'
    };
    const defaultRoute = window.location.pathname.includes('rankings') ?
      defaultViews.rankings : defaultViews.map;
    const appRoutes: Routes = [
      {
        path: ':locations/:year/:geography/:type/:choropleth/:bounds',
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
