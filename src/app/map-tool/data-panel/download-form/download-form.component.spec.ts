import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { UiModule } from '../../../ui/ui.module';
import { DownloadFormComponent } from './download-form.component';
import { FileExportService } from './file-export.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

const mockResponse = { path: 'http://localhost' };

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

export class FileExportStub {
  getFileTypes() {
    return [
      { name: 'Excel', value: 'xlsx', path: '/format/xlsx', checked: false },
      { name: 'PowerPoint', value: 'pptx', path: '/format/pptx', checked: false },
      { name: 'PDF', value: 'pdf', path: '/pdf', checked: false }
    ];
  }
  setExportValues(...args) {}
  sendFileRequest(...args) {
    return { subscribe: (...sArgs) => {} };
  }
}

describe('DownloadFormComponent', () => {
  let component: DownloadFormComponent;
  let fixture: ComponentFixture<DownloadFormComponent>;
  let submitButtonEl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ModalModule.forRoot(), UiModule, TranslateModule.forRoot() ],
      declarations: [ DownloadFormComponent ],
      providers: [ BsModalService, BsModalRef ]
    });
    TestBed.overrideComponent(DownloadFormComponent, {
      set: {
        providers: [
          { provide: FileExportService, useValue: new FileExportStub() },
          { provide: TranslatePipe, useClass: TranslatePipeMock }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFormComponent);
    component = fixture.componentInstance;
    submitButtonEl = fixture.debugElement.query(By.css('.btn-primary'));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the loading indicator if not loading', () => {
    expect(component.loading).toBeFalsy();
  });

  it('should display the loading indicator before response returned', () => {
    component.filetypes[0].checked = true;
    submitButtonEl.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.loading).toBeTruthy();
  });

  // TODO: Mock HTTP response
  // it('should remove the loading indicator when response returned', () => {

  // });

  // it('should remove the loading indicator when response fails', () => {

  // });
});
