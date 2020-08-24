import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MapboxComponent } from './mapbox.component';
import { MapService } from '../map.service';
import { PlatformService } from '../../../services/platform.service';
import { ScrollService } from '../../../services/scroll.service';
import { ServicesModule } from '../../../services/services.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';

describe('MapboxComponent', () => {
  let component: MapboxComponent;
  let fixture: ComponentFixture<MapboxComponent>;
  const mapConfigStub = {
    style: '/assets/style.json',
    center: [-77.99, 41.041480],
    zoom: 6.5,
    minZoom: 3,
    maxZoom: 14,
    container: 'map'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ServicesModule.forRoot()
      ],
      declarations: [
        MapboxComponent
      ],
      providers: [ MapService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapboxComponent);
    component = fixture.componentInstance;
    component.mapConfig = mapConfigStub;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
