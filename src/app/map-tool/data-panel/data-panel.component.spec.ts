import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DataPanelComponent } from './data-panel.component';
import { DataPanelModule } from './data-panel.module';
import { FileExportService } from './download-form/file-export.service';
import { DownloadFormComponent } from './download-form/download-form.component';
import { ServicesModule } from '../../services/services.module';
import { MapToolService } from '../map-tool.service';
import { DataAttributes } from '../data/data-attributes';
import { DataLevels } from '../data/data-levels';
import { Pipe, PipeTransform } from '@angular/core';

export class FileExportStub {
  getFileTypes() {
    return [
      { name: 'Excel', value: 'xlsx', path: '/format/xlsx', checked: false },
      { name: 'PowerPoint', value: 'pptx', path: '/format/pptx', checked: false },
      { name: 'PDF', value: 'pdf', path: '/pdf', checked: false }
    ];
  }
  setExportValues(...args) {}
  sendFileRequest(...args) {}
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
  usAverageLoaded = new EventEmitter<any>();
  getRouteArray() { return []; }
}

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

@Pipe({ name: 'decimal' })
export class DecimalPipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}


describe('DataPanelComponent', () => {
  let component: DataPanelComponent;
  let fixture: ComponentFixture<DataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DataPanelModule,
        HttpModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        ServicesModule.forRoot()
      ]
    });
    TestBed.overrideComponent(DataPanelComponent, {
      set: {
        providers: [
          { provide: MapToolService, useClass: MapToolServiceStub },
          { provide: TranslatePipe, useClass: TranslatePipeMock },
          { provide: DecimalPipe, useClass: DecimalPipeMock },
          TranslateService
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
