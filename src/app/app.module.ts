import * as Raven from 'raven-js';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastModule, ToastOptions } from 'ng2-toastr';
import { environment } from '../environments/environment';
import { version } from '../environments/version';

// local imports
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { MapToolComponent } from './map-tool/map-tool.component';
import { RankingModule } from './ranking/ranking.module';
import { RankingToolComponent } from './ranking/ranking-tool/ranking-tool.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ServicesModule } from './services/services.module';
import { EmbedComponent } from './map-tool/embed/embed.component';

import { WebpackTranslateLoader } from './webpack-translate-loader';
import { CardEmbedComponent } from './map-tool/location-cards/embed/card-embed.component';

Raven
  .config('https://415ec06453064044bac03fcdab3d2882@sentry.io/1193815', {
    release: version
  })
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    if (environment.production) {
      Raven.captureException(err);
    } else {
      console.error(err);
    }
  }
}

export class CustomOption extends ToastOptions {
  showCloseButton = true;
  positionClass = 'toast-bottom-left';
  maxShown = 1;
  newestOnTop = false;
}

@NgModule({
  declarations: [ AppComponent, HeaderBarComponent, FooterComponent, MenuComponent ],
  imports: [
    UiModule,
    MapToolModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RankingModule.forRoot({
      evictorsUrl: environment.evictorsRankingDataUrl,
      cityUrl: environment.cityRankingDataUrl,
      stateUrl: environment.stateRankingDataUrl
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    }),
    ServicesModule.forRoot(),
    RouterModule.forRoot([], { useHash: true }),
    TooltipModule.forRoot(),
    ToastModule.forRoot(),
    NgxPageScrollCoreModule.forRoot({
      duration: 1000, 
      scrollOffset: 120,
      easingLogic: (t, b, c, d) => -c * (t /= d) * (t - 2) + b
    }),
    NgxPageScrollModule
  ],
  providers: [
    { provide: ToastOptions, useClass: CustomOption },
    { provide: ErrorHandler, useClass: RavenErrorHandler },
    Title
  ],
  bootstrap: [AppComponent],
  entryComponents: [ MapToolComponent, RankingToolComponent, EmbedComponent, CardEmbedComponent ]
})
export class AppModule { }
