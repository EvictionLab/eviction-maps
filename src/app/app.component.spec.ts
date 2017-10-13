import { TestBed, async } from '@angular/core/testing';
import { SmoothScrollToDirective, SmoothScrollDirective } from 'ng2-smooth-scroll';

import { AppComponent } from './app.component';
import { MapboxComponent } from './map/mapbox/mapbox.component';
import { MapUiModule } from './map-ui/map-ui.module';
import { GraphModule } from 'angular-d3-graph/module';
import { PlatformService } from './platform.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    const mapboxServiceStub = {
      accessToken: ''
    };
    TestBed.configureTestingModule({
      imports: [
        MapUiModule,
        GraphModule
      ],
      declarations: [
        AppComponent,
        MapboxComponent,
        SmoothScrollToDirective,
        SmoothScrollDirective
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
