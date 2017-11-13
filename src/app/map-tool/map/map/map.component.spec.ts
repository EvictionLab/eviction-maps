import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { MapboxComponent } from '../mapbox/mapbox.component';
import { UiModule } from '../../../ui/ui.module';
import { HttpModule } from '@angular/http';
import { MapService } from '../map.service';
import { DataService } from '../../../data/data.service';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent, MapboxComponent ],
      imports: [ UiModule, HttpModule ],
      providers: [
        { provide: MapService, useValue: { updateCensusSource: () => {} } },
        DataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    component.choroplethOptions = [{
      'id': 'none',
      'name': 'None',
      'default': 'rgba(0, 0, 0, 0)',
      'fillStops': {
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
