import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapUiModule } from './map-ui/map-ui.module';
import { LayerSelectComponent } from './map-ui/layer-select/layer-select.component';
import { MapBoxModule } from 'angular-mapbox/module';
import { MapboxService } from 'angular-mapbox/services/mapbox.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    const mapboxServiceStub = {
      accessToken: ''
    };
    TestBed.configureTestingModule({
      imports: [
        MapBoxModule
      ],
      declarations: [
        AppComponent,
        MapComponent,
        LayerSelectComponent
      ],
      providers: [
        { provide: MapboxService, useValue: mapboxServiceStub }
      ]
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
