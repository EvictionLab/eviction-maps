import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MapComponent } from './map.component';
import { MapboxComponent } from '../mapbox/mapbox.component';
import { UiModule } from '../../../ui/ui.module';
import { MapService } from '../map.service';

class mapServiceStub {
  updateCensusSource() {}
  createMap(settings) { return this; }
  addControl(...args) { return this; }
  on(...args) { return this; }
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent, MapboxComponent ],
      imports: [ UiModule, TranslateModule.forRoot() ]
    })
    TestBed.overrideComponent(MapComponent, {
      set: {
        providers: [ {provide: MapService, useValue: new mapServiceStub()  } ],
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
      'name': 'None',
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
    }];
    component.bubbleOptions = [{
      'id': 'none',
      'name': 'None'
    }];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
