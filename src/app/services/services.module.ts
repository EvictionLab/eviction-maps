import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// local imports
import { PlatformService } from './platform.service';
import { LoadingService } from './loading.service';
import { ToggleScrollService } from './toggle-scroll.service';
import { AnalyticsService } from './analytics.service';
import { RoutingService } from './routing.service';

@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        ToggleScrollService,
        PlatformService,
        LoadingService,
        AnalyticsService,
        RoutingService
      ]
    };
  }
}
