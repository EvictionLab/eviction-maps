import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MapToolComponent } from './map-tool.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { DataService } from '../data/data.service';
import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MapToolModule } from './map-tool.module';
import { DataAttributes, BubbleAttributes } from '../data/data-attributes';
import { DataLevels } from '../data/data-levels';
import { ToastModule } from 'ng2-toastr';
import { LoadingService } from '../loading.service';

export class TranslateServiceStub {
  public get(key: any): any {
    Observable.of(key);
  }
}

export class DataServiceStub {
  get dataLevels() { return DataLevels; }
  get dataAttributes() { return DataAttributes; }
  get bubbleAttributes() { return BubbleAttributes; }
  activeYear = 2010;
  activeFeatures = [];
  locations$ = Observable.of([]);
  activeDataLevel = DataLevels[0];
  activeDataHighlight = DataAttributes[0];
  activeBubbleHighlight = BubbleAttributes[0];
  mapView;
  mapConfig;
  getRouteArray() { return []; }
  loadUSAverage() {}
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
        ToastModule.forRoot()
      ]
    });
    TestBed.overrideComponent(MapToolComponent, {
      set: {
        providers: [
          {provide: DataService, useClass: DataServiceStub },
          TranslateService,
          LoadingService
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
