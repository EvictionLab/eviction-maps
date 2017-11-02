import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { UiModule } from '../../../ui/ui.module';
import { MockBackend } from '@angular/http/testing';
import { DownloadFormComponent } from './download-form.component';

const mockResponse = { path: 'http://localhost' };

describe('DownloadFormComponent', () => {
  let component: DownloadFormComponent;
  let fixture: ComponentFixture<DownloadFormComponent>;
  let submitButtonEl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, UiModule, ModalModule.forRoot() ],
      declarations: [ DownloadFormComponent ],
      providers: [ BsModalService, BsModalRef, { provide: XHRBackend, useClass: MockBackend } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFormComponent);
    component = fixture.componentInstance;
    component.lang = 'en';
    component.features = [
      {
        type: 'Feature',
        properties: { n: 'Test One' },
        geometry: { type: 'Point', coordinates: [0, 0] }
      },
      {
        type: 'Feature',
        properties: { n: 'Test Two' },
        geometry: { type: 'Point', coordinates: [0, 0] }
      }
    ];
    component.startYear = 2010;
    component.endYear = 2016;
    submitButtonEl = fixture.debugElement.query(By.css('.btn-primary'));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create a DownloadRequest with parameters', () => {
    component.filetypes[0].checked = true;
    const downloadRequest = component.createDownloadRequest([component.filetypes[0].value]);
    expect(downloadRequest.lang).toBe('en');
    expect(downloadRequest.hasOwnProperty('formats')).toBe(false);
  });

  it('should include formats in request if more than one filetype selected', () => {
    const downloadRequest = component.createDownloadRequest(['pptx', 'xlsx']);
    expect(downloadRequest.formats).toEqual(['pptx', 'xlsx']);
  });

  it('should not display the loading indicator if not loading', () => {
    const progressBar = fixture.debugElement.query(By.css('.progress-line'));
    expect(progressBar).toBeFalsy();
  });

  it('should display the loading indicator before response returned', () => {
    component.filetypes[0].checked = true;
    submitButtonEl.triggerEventHandler('click', null);
    fixture.detectChanges();
    const progressBar = fixture.debugElement.query(By.css('.progress-line'));
    expect(progressBar).toBeTruthy();
  });

  // TODO: Mock HTTP response
  it('should remove the loading indicator when response returned', () => {

  });

  it('should remove the loading indicator when response fails', () => {

  });
});
