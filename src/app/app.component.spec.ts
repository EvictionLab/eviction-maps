import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { DataPanelModule } from './data-panel/data-panel.module';
import { MapUiModule } from './map-ui/map-ui.module';
import { PlatformService } from './platform.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    const mapboxServiceStub = {
      accessToken: ''
    };
    TestBed.configureTestingModule({
      imports: [
        MapUiModule,
        MapModule,
        DataPanelModule
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

  it(`should have as title 'Eviction Lab'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Eviction Lab');
  }));

});
