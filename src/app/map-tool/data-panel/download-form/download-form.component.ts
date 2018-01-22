import { Component, EventEmitter, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DialogResponse } from '../../../ui/ui-dialog/ui-dialog.types';
import { FileExportService, ExportType } from './file-export.service';

@Component({
  selector: 'app-download-form',
  templateUrl: './download-form.component.html',
  styleUrls: ['./download-form.component.scss'],
  providers: [ FileExportService, TranslatePipe ]
})
export class DownloadFormComponent implements OnInit {
  filetypes: ExportType[];
  loading = false;
  buttonClicked = new EventEmitter<DialogResponse>();
  exportDescription = 'DATA.EXPORT_ONE_FEATURE_DESCRIPTION';
  exportDescriptionParams = {};

  constructor(
    public exportService: FileExportService,
    public bsModalRef: BsModalRef,
    private translatePipe: TranslatePipe
  ) { }

  ngOnInit() {
    this.filetypes = this.exportService.getFileTypes();
  }

  setFormConfig(config: Object) {
    this.exportService.setExportValues(config);
    const exportParams = {
      startYear: this.exportService.startYear,
      endYear: this.exportService.endYear,
      feature1: this.exportService.features[0].properties.n
    };
    if (this.exportService.features.length === 1) {
      this.exportDescription = 'DATA.EXPORT_ONE_FEATURE_DESCRIPTION';
    }
    if (this.exportService.features.length === 2) {
      this.exportDescription = 'DATA.EXPORT_TWO_FEATURES_DESCRIPTION';
      exportParams['feature2'] = this.exportService.features[1].properties.n;
    }
    if (this.exportService.features.length === 3) {
      this.exportDescription = 'DATA.EXPORT_THREE_FEATURES_DESCRIPTION';
      exportParams['feature2'] = this.exportService.features[1].properties.n;
      exportParams['feature3'] = this.exportService.features[2].properties.n;
    }
    this.exportDescriptionParams = exportParams;
  }

  onDownloadClick(e) {
    this.loading = true;
    const filetypes = this.filetypes
      .filter(f => f.checked).map(f => f.value);
    this.exportService.sendFileRequest(filetypes)
      .subscribe(res => {
        if (!res.hasOwnProperty('path')) {
          console.log(`Error occured: ${res}`);
          this.loading = false;
        } else {
          window.location.href = res['path'];
          this.dismiss({ accepted: true });
          this.loading = false;
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
