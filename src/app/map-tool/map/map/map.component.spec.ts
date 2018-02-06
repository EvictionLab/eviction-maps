import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { MapComponent } from './map.component';
import { MapboxComponent } from '../mapbox/mapbox.component';
import { UiModule } from '../../../ui/ui.module';
import { MapService } from '../map.service';
import { LoadingService } from '../../../services/loading.service';
import { PlatformService } from '../../../services/platform.service';
import { ToggleScrollService } from '../../../services/toggle-scroll.service';
import { UiMapLegendComponent } from '../map-legend/ui-map-legend.component';
import { LocationCardsModule } from '../../location-cards/location-cards.module';

class MapServiceStub {
  updateCensusSource() {}
  createMap(settings) { return this; }
  addControl(...args) { return this; }
  on(...args) { return this; }
  filterLayerGroupsByZoom(...args) {
    return [{
      'id': 'states',
      'name': 'States',
      'layerIds': ['states'],
      'minzoom': 0,
      'zoom': [0, 7]
    }];
  }
  updateHighlightFeatures(...args) { return this; }
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent, MapboxComponent, UiMapLegendComponent ],
      imports: [ UiModule, TranslateModule.forRoot(), TooltipModule.forRoot(), LocationCardsModule ]
    });
    TestBed.overrideComponent(MapComponent, {
      set: {
        providers: [
          PlatformService,
          { provide: MapService, useValue: new MapServiceStub() },
          LoadingService,
          ToggleScrollService
        ],
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    component.year = 2010;
    component.choroplethOptions = [{
      'id': 'none',
      'type': 'choropleth',
      'langKey': 'STATS.NONE',
      'default': 'rgba(0, 0, 0, 0)',
      'stops': {
        'default': [
          [0, 'rgba(0, 0, 0, 0)']
        ]
      }
    }];
    component.layerOptions = [{
      'id': 'states',
      'name': 'States',
      'layerIds': ['states'],
      'minzoom': 0,
      'zoom': [0, 7]
    },
    {
      'id': 'counties',
      'name': 'Counties',
      'layerIds': ['counties'],
      'minzoom': 0,
      'zoom': [7, 9]
    },
    {
      'id': 'cities',
      'name': 'Cities',
      'layerIds': ['cities'],
      'minzoom': 6,
      'zoom': [9, 10]
    }];
    component.bubbleOptions = [{
      'id': 'none',
      'langKey': '',
      'name': 'None'
    }];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a year change event on year input change', fakeAsync(() => {
    component.yearChange.subscribe(y => { expect(y).toEqual(2011); });
    component.year = 2011;
    tick(500);
    fixture.detectChanges();
    tick(500);
  }));

  it('should move to auto-switching layers if zoom is less than layer minzoom', fakeAsync(() => {
    component.onMapZoomEnd(10);
    component.selectedLayer = component.layerOptions[2];
    component.autoSwitch = false;
    tick(200);
    fixture.detectChanges();
    expect(component.autoSwitch).toBe(false);
    component.onMapZoomEnd(2);
    tick(300);
    fixture.detectChanges();
    expect(component.autoSwitch).toBe(true);
  }));
});
