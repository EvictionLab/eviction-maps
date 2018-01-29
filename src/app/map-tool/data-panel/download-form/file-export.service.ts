import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MapFeature } from '../../map/map-feature';
import * as bbox from '@turf/bbox';

export interface DownloadRequest {
  lang: string;
  year: number;
  dataProp: string;
  bubbleProp: string;
  years: number[];
  features: MapFeature[];
  formats?: string[];
  showUsAverage: boolean;
  usAverage: Object;
}

export interface ExportType {
  name: string;
  value: string;
  path: string;
  checked: boolean;
  description: string;
}

@Injectable()
export class FileExportService {
  downloadBase = environment.downloadBaseUrl;
  lang: string;
  features: MapFeature[];
  year: number;
  startYear: number;
  endYear: number;
  dataProp: string;
  bubbleProp: string;
  description: string;
  showUsAverage: boolean;
  usAverage: Object;
  filetypes: ExportType[] = [
    {
      name: 'Excel',
      value: 'xlsx',
      path: '/format/xlsx',
      checked: false,
      description: 'DATA.EXCEL_DESCRIPTION'
    },
    {
      name: 'PowerPoint',
      value: 'pptx',
      path: '/format/pptx',
      checked: false,
      description: 'DATA.POWERPOINT_DESCRIPTION'
    },
    {
      name: 'PDF',
      value: 'pdf',
      path: '/pdf',
      checked: false,
      description: 'DATA.PDF_DESCRIPTION'
    }
  ];

  constructor(private http: HttpClient) { }

  getFileTypes() { return this.filetypes; }

  /**
   * Sets the values for the export
   */
  setExportValues(config: Object) {
    this.lang = config['lang'];
    this.features = config['features'];
    this.year = config['year'];
    this.startYear = config['startYear'];
    this.endYear = config['endYear'];
    this.dataProp = config['dataProp'];
    this.bubbleProp = config['bubbleProp'];
    this.showUsAverage = config['showUsAverage'];
    this.usAverage = config['usAverage'];
  }

  /**
   * Create the file request data
   */
  createDownloadRequest(fileValues: string[]): DownloadRequest {
    const exportFeatures = this.features.map(f => {
      if (!f.hasOwnProperty('bbox')) { f.bbox = bbox(f); }
      return f;
    });
    const downloadRequest: DownloadRequest = {
      lang: this.lang, year: this.year, years: [this.startYear, this.endYear],
      features: exportFeatures, dataProp: this.dataProp, bubbleProp: this.bubbleProp,
      showUsAverage: this.showUsAverage, usAverage: this.usAverage
    };
    if (this.filetypes.filter(f => fileValues.indexOf(f.value) !== -1).length > 1) {
      downloadRequest.formats = fileValues;
    }
    return downloadRequest;
  }

  /**
   * Sends a request for the provided file types
   * @param types an array of filetypes containing one or more of 'xls', 'pptx', 'pdf'
   */
  sendFileRequest(types: Array<string> = []) {
    if (types.length === 0) { throw new Error('Sent file request with no file type specified.'); }
    const downloadRequest = this.createDownloadRequest(types);
    const downloadPath = types.length > 1 ?
      `${this.downloadBase}/format/zip` : this.downloadBase + this.getFileTypePath(types[0]);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(downloadPath, JSON.stringify(downloadRequest), { headers: headers});
  }

  /** Gets the path for the given file type */
  private getFileTypePath(type: string): string {
    return this.filetypes.find(f => f.value === type).path;
  }
}
