import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { MapToolModule } from './map-tool/map-tool.module';
import { PlatformService } from './platform.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        MapToolModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [ PlatformService ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
