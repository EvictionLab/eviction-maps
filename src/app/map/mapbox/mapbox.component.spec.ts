import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapboxComponent } from './mapbox.component';
import { MapBoxModule } from 'angular-mapbox/module';
import { MapboxService } from 'angular-mapbox/services/mapbox.service';

describe('MapboxComponent', () => {
  let component: MapboxComponent;
  let fixture: ComponentFixture<MapboxComponent>;

  beforeEach(async(() => {
    const mapboxServiceStub = {
      accessToken: '',
      map: () => ({ on: () => {}, emit: () => {} }),
      addControl: () => {},
      addNavigationControl: () => {}
    };
    TestBed.configureTestingModule({
      imports: [
        MapBoxModule.forRoot(
          'pk.eyJ1IjoiZXZpY3Rpb25sYWIiLCJhIjoiY2o2Z3NsMG85MDF6dzMybW15cWswMGJwNCJ9' +
          '.PW6rLbRiQdme0py5f8IstA'
        )
      ],
      declarations: [ MapboxComponent ],
      providers: [
        { provide: MapboxService, useValue: mapboxServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
