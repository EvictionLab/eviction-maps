import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { MapBoxModule } from 'angular-mapbox/module';
import { MapboxService } from 'angular-mapbox/services/mapbox.service';
import { MapboxComponent } from 'angular-mapbox/mapbox/mapbox.component';


describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    const mapboxServiceStub = {
      accessToken: '',
      map: () => ({ on: () => {}, emit: () => {} }),
      addControl: () => {},
      addNavigationControl: () => {}
    };
    TestBed.configureTestingModule({
      imports: [ MapBoxModule ],
      declarations: [ MapComponent ],
      providers: [
        { provide: MapboxService, useValue: mapboxServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
