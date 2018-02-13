import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Routes } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/combineLatest';
import { environment } from '../../environments/environment';
import { PlatformService } from './platform.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface MapRouteData {
  year: number;
  geography: string;
  bounds: string;
  lang?: string;
  type?: string;
  choropleth?: string;
  locations?: string;
  graph?: string;
}

export interface RankingsRouteData {
  tab: string;
  region?: string;
  areaType?: number;
  sortProp?: string;
  index?: number;
  lang?: string;
}

@Injectable()
export class RoutingService {
  urlParts;
  route: ActivatedRoute;
  routeData = new BehaviorSubject<MapRouteData | RankingsRouteData>({
    year: environment.maxYear,
    geography: 'auto',
    bounds: '-136.80,20.68,-57.60,52.06'
  });
  private mapRouteKeys = ['year', 'geography', 'bounds']; // keys mandatory for map route
  private rankingsRouteKeys = ['tab', 'region', 'areaType', 'sortProp']; // mandatory rankings keys

  private defaultViews = {
    map: `/${environment.maxYear}/auto/-136.80,20.68,-57.60,52.06`,
    rankings: '/evictions/United%20States/0/evictionRate',
    evictors: '/evictors'
  };

  constructor(
    private router: Router,
    private platform: PlatformService
  ) {}

  /** Gets route data for the map component */
  getCombinedRouteData() {
    return Observable.combineLatest(
      this.route.params,
      this.route.queryParams,
      (params, queryParams) => ({ ...params, ...queryParams })
    );
  }

  /** Sets the active route from the current component */
  setActivatedRoute(route: ActivatedRoute) {
    this.route = route;
    this.route.url.subscribe((url) => { this.urlParts = url; });
  }

  /** Checks if the provided key / value is a valid query parameter */
  isValidQueryParam(key, value) {
    const keys = this.mapRouteKeys.concat(this.rankingsRouteKeys);
    return (
      (
        keys.indexOf(key) === -1 &&
        value !== '' &&
        value !== 'none' &&
        value !== 'line'
      )
    );
  }

  /** Update the route based on current data */
  updateRouteData(currentData: MapRouteData | RankingsRouteData) {
    const routeKeys = 'bounds' in currentData ? this.mapRouteKeys : this.rankingsRouteKeys;
    const routeArray = routeKeys.map(k => currentData[k]); // array of route data
    // grab non-route keys as query params
    const queryParams = Object.keys(currentData)
      .filter(k => this.isValidQueryParam(k, currentData[k]))
      .reduce((acc, cur) => { acc[cur] = currentData[cur]; return acc; }, {});
    if (this.urlParts && this.urlParts.length && this.urlParts[0].path !== 'editor') {
      setTimeout(() => {
        this.router.navigate(routeArray, { replaceUrl: true, queryParams });
      });
    }
  }

  /** Route Configuration */
  setupRoutes(components: any) {
    // sets the default route based on the page URL
    const defaultRoute =
      this.platform.nativeWindow.location.pathname.includes('rankings') ?
        this.defaultViews.rankings : this.defaultViews.map;
    // all routes for the app
    const appRoutes: Routes = [
      { path: 'embed/:year/:geography/:bounds', component: components.embed },
      { path: ':year/:geography/:bounds', component: components.map },
      // { path: 'evictors', component: components.rankings },
      { path: ':tab', redirectTo: this.defaultViews.rankings },
      { path: ':tab/:region/:areaType/:sortProp', component: components.rankings },
      { path: '', redirectTo: defaultRoute, pathMatch: 'full' } // default route based on URL path
    ];
    // reset router with dynamic routes
    this.router.resetConfig(appRoutes);
  }

}
