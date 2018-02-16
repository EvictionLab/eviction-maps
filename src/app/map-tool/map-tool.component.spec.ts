import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MapToolComponent } from './map-tool.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MapToolService } from './map-tool.service';
import { ScrollService } from '../services/scroll.service';
import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MapToolModule } from './map-tool.module';
import { DataAttributes } from './data/data-attributes';
import { DataLevels } from './data/data-levels';
import { ToastModule } from 'ng2-toastr';
import { LoadingService } from '../services/loading.service';
import { ServicesModule } from '../services/services.module';

export class TranslateServiceStub {
  public get(key: any): any {
    Observable.of(key);
  }
}

export class MapToolServiceStub {
  get dataLevels() { return DataLevels; }
  get dataAttributes() { return DataAttributes; }
  get bubbleAttributes() { return DataAttributes; }
  activeYear = 2010;
  activeFeatures = [];
  locations$ = Observable.of([]);
  activeDataLevel = DataLevels[0];
  activeDataHighlight = DataAttributes[0];
  activeBubbleHighlight = DataAttributes[0];
  mapView;
  mapConfig;
  getQueryParameters() { return []; }
  getRouteArray() { return []; }
  loadUSAverage() { }
  setCurrentData(...args) { return; }
  getCurrentData() { return {}; }
}

describe('MapToolComponent', () => {
  let component: MapToolComponent;
  let fixture: ComponentFixture<MapToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MapToolModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ToastModule.forRoot(),
        ServicesModule.forRoot()
      ]
    });
    TestBed.overrideComponent(MapToolComponent, {
      set: {
        providers: [
          {provide: MapToolService, useClass: MapToolServiceStub },
          TranslateService
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
