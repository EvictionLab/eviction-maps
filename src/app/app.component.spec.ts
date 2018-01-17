import { TestBed, async } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { PlatformService } from './platform.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { FooterComponent } from './footer/footer.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DataService } from './data/data.service';
import { ToastModule } from 'ng2-toastr';
import { LoadingService } from './loading.service';

export class TranslateServiceStub {
  public get(key: any): any {
    Observable.of(key);
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        MapToolModule,
        RouterTestingModule,
        TranslateModule,
        TooltipModule.forRoot(),
        ToastModule.forRoot()
      ],
      declarations: [
        AppComponent, HeaderBarComponent, FooterComponent
      ],
      providers: [
        PlatformService,
        LoadingService,
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: DataService, useValue: { languageOptions: [] } },
        { provide: Title, useValue: { setTitle: (...args) => {} } }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
