import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastModule, ToastOptions } from 'ng2-toastr';

// local imports
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { MapToolComponent } from './map-tool/map-tool.component';
import { PlatformService } from './platform.service';
import { RankingModule } from './ranking/ranking.module';
import { RankingToolComponent } from './ranking/ranking-tool/ranking-tool.component';
import { DataService } from './data/data.service';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingService } from './loading.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class CustomOption extends ToastOptions {
  showCloseButton = true;
  positionClass = 'toast-bottom-left';
  maxShown = 1;
}

@NgModule({
  declarations: [ AppComponent, HeaderBarComponent, FooterComponent ],
  imports: [
    UiModule,
    MapToolModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RankingModule.forRoot({
      dataUrl: 'https://s3.amazonaws.com/eviction-lab-data/rankings/city-rankings.csv'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot([], { useHash: true }),
    TooltipModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    PlatformService,
    DataService,
    LoadingService,
    {provide: ToastOptions, useClass: CustomOption}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ MapToolComponent, RankingToolComponent ]
})
export class AppModule { }
