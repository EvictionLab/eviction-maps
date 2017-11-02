import { Component, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { MapFeature } from '../../map/map-feature';
import { DialogResponse } from '../../../ui/ui-dialog/ui-dialog.types';

interface DownloadRequest {
  lang: string;
  years: number[];
  features: MapFeature[];
  formats?: string[];
}

interface ExportType {
  name: string;
  value: string;
  path: string;
  checked: boolean;
}

@Component({
  selector: 'app-download-form',
  templateUrl: './download-form.component.html',
  styleUrls: ['./download-form.component.scss']
})
export class DownloadFormComponent {
  downloadBase = 'https://exports.evictionlab.org';
  lang: string;
  features: MapFeature[];
  startYear: number;
  endYear: number;
  filetypes: ExportType[] = [
    { name: 'Excel', value: 'xlsx', path: '/format/xlsx', checked: false },
    { name: 'PowerPoint', value: 'pptx', path: '/format/pptx', checked: false },
    { name: 'PDF', value: 'pdf', path: '/pdf', checked: false }
  ];
  loading = false;
  buttonClicked = new EventEmitter<DialogResponse>();

  constructor(private http: Http, public bsModalRef: BsModalRef) { }

  setFormConfig(config: Object) {
    this.lang = config['lang'];
    this.features = config['features'];
    this.startYear = config['startYear'];
    this.endYear = config['endYear'];
  }

  createDownloadRequest(fileValues: string[]): DownloadRequest {
    const downloadRequest: DownloadRequest = {
      lang: this.lang, years: [this.startYear, this.endYear], features: this.features
    };
    if (this.filetypes.filter(f => fileValues.indexOf(f.value) !== -1).length > 1) {
      downloadRequest.formats = fileValues;
    }
    return downloadRequest;
  }

  onDownloadClick(e) {
    this.loading = true;
    const filetypes = this.filetypes.filter(f => f.checked);
    const downloadRequest = this.createDownloadRequest(filetypes.map(f => f.value));
    const downloadPath = filetypes.length > 1 ?
      `${this.downloadBase}/format/zip` : `${this.downloadBase}${filetypes[0].path}`;

    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.http.post(downloadPath, JSON.stringify(downloadRequest), { headers: headers})
      .subscribe(res => {
        this.loading = false;
        const jsonRes = res.json();
        if (!jsonRes.hasOwnProperty('path')) {
          console.log(`Error occured: ${jsonRes}`);
        } else {
          window.location.href = jsonRes['path'];
          this.dismiss({ accepted: true });
        }
      });
  }

  onCancelClick(e) {
    this.dismiss({ accepted: false });
  }

  private dismiss(data) {
    this.buttonClicked.emit(data);
    this.bsModalRef.hide();
  }

}
