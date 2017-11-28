import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { PlatformService } from './platform.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

export class TranslateServiceStub{
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
        TranslateModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [ PlatformService, {provide: TranslateService, useClass: TranslateServiceStub} ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
