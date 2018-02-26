import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// local imports
import { PlatformService } from './platform.service';
import { LoadingService } from './loading.service';
import { ScrollService } from './scroll.service';
import { AnalyticsService } from './analytics.service';
import { RoutingService } from './routing.service';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { SearchService } from './search.service';

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
        ScrollService,
        PlatformService,
        LoadingService,
        AnalyticsService,
        RoutingService,
        SearchService
      ]
    };
  }
}
