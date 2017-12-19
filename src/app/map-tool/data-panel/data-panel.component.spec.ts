import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataPanelComponent } from './data-panel.component';
import { DataPanelModule } from './data-panel.module';
import { FileExportService } from './download-form/file-export.service';
import { DownloadFormComponent } from './download-form/download-form.component';
import { PlatformService } from '../../platform.service';

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


describe('DataPanelComponent', () => {
  let component: DataPanelComponent;
  let fixture: ComponentFixture<DataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DataPanelModule, HttpClientModule, TranslateModule.forRoot() ]
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
