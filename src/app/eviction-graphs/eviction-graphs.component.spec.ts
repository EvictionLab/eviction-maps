import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphModule } from '../graph/graph.module';
import { UiModule } from '../ui/ui.module';

import { EvictionGraphsComponent } from './eviction-graphs.component';

import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Pipe, PipeTransform, EventEmitter } from '@angular/core';
import { EvictionGraphsModule } from './eviction-graphs.module';
import { GraphService } from './graph.service';
import { ServicesModule } from '../services/services.module';
import { MapToolService } from '../map-tool/map-tool.service';
import { DataAttributes } from '../map-tool/data/data-attributes';
import { DataLevels } from '../map-tool/data/data-levels';

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

export class MapToolServiceStub {
  get dataLevels() { return DataLevels; }
  get dataAttributes() { return DataAttributes; }
  get bubbleAttributes() { return DataAttributes; }
  activeYear = 2010;
  activeFeatures = [];
  activeDataLevel = DataLevels[0];
  activeDataHighlight = DataAttributes[0];
  activeBubbleHighlight = DataAttributes[0];
  mapView;
  mapConfig;
  usAverage = {};
  graphDisplayCI;
  usAverageLoaded = new EventEmitter<any>();
  getRouteArray() { return []; }
}

describe('EvictionGraphsComponent', () => {
  let component: EvictionGraphsComponent;
  let fixture: ComponentFixture<EvictionGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ServicesModule.forRoot(),
        GraphModule.forRoot(),
        EvictionGraphsModule,
        TranslateModule.forRoot(),
        UiModule
      ],
    });
    TestBed.overrideComponent(EvictionGraphsComponent, {
      set: {
        providers: [
          { provide: TranslatePipe, useClass: TranslatePipeMock },
          { provide: MapToolService, useClass: MapToolServiceStub },
          TranslateService,
          GraphService
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvictionGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
