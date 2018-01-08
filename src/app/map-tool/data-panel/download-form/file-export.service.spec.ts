import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileExportService } from './file-export.service';

describe('FileExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [FileExportService]
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should be created', inject([FileExportService], (service: FileExportService) => {
    expect(service).toBeTruthy();
  }));

  it('should create a DownloadRequest with parameters', inject(
    [FileExportService], (service: FileExportService) => {
      service.setExportValues({
        lang: 'en',
        features: [],
        startYear: '2001',
        endYear: '2004'
      });
      const downloadRequest = service.createDownloadRequest(['xlsx']);
      expect(downloadRequest.lang).toBe('en');
      expect(downloadRequest.hasOwnProperty('formats')).toBe(false);
    }
  ));

  it(
    'should include formats in request if more than one filetype selected',
    inject(
      [FileExportService], (service: FileExportService) => {
        const downloadRequest = service.createDownloadRequest(['pptx', 'xlsx']);
        expect(downloadRequest.formats).toEqual(['pptx', 'xlsx']);
      }
    )
  );

  it('should send a file request', async(
    inject(
      [FileExportService, HttpTestingController],
      (service: FileExportService, backend: HttpTestingController) => {
        service.setExportValues({
          lang: 'en',
          features: [],
          startYear: '2001',
          endYear: '2004'
        });
        service.sendFileRequest(['xlsx']).subscribe();
        backend.expectOne((req: HttpRequest<any>) => {
          const body = JSON.parse(req.body);
          return req.url === 'https://exports.evictionlab.org/format/xlsx'
            && req.method === 'POST'
            && req.headers.get('Content-Type') === 'application/json'
            && body.lang === 'en'
            && body.years[0] === '2001'
            && body.years[1] === '2004'
            && body.features.length === 0;
        }, `POST to endpoint with data`);
      }
    )
  ));
});
