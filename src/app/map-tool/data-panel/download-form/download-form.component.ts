import { Component, EventEmitter, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DialogResponse } from '../../../ui/ui-dialog/ui-dialog.types';
import { ToastsManager } from 'ng2-toastr';
import { FileExportService, ExportType } from './file-export.service';
import { AppDialog } from '../../../ui/ui-dialog/ui-dialog.types';

@Component({
  selector: 'app-download-form',
  templateUrl: './download-form.component.html',
  styleUrls: ['./download-form.component.scss'],
  providers: [ FileExportService, TranslatePipe ]
})
export class DownloadFormComponent implements OnInit, AppDialog {
  filetypes: ExportType[];
  loading = false;
  buttonClicked: EventEmitter<any> = new EventEmitter<any>();
  exportDescription = 'DATA.EXPORT_ONE_FEATURE_DESCRIPTION';
  exportDescriptionParams = {};
  get optionChecked() {
    return this.filetypes.reduce((acc, cur) => (acc || cur.checked ), false);
  }

  constructor(
    public exportService: FileExportService,
    public bsModalRef: BsModalRef,
    private translatePipe: TranslatePipe,
    private toast: ToastsManager
  ) {
    // Add click to dimiss to all toast messages
    this.toast.onClickToast().subscribe(t => this.toast.dismissToast(t));
  }

  ngOnInit() {
    this.filetypes = this.exportService.getFileTypes();
  }

  setDialogConfig(config: Object) {
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
    if (!this.optionChecked) { return; }
    this.loading = true;
    const filetypes = this.filetypes
      .filter(f => f.checked).map(f => f.value);
    this.buttonClicked.emit({ accepted: true, filetypes: filetypes.join(',') });
    this.exportService.sendFileRequest(filetypes)
      .subscribe(res => {
        if (!res.hasOwnProperty('path')) {
          this.loading = false;
          throw (new Error(`Error occured: ${res}`));
        } else {
          window.location.href = res['path'];
          this.dismiss({ accepted: true });
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.toast.error(this.translatePipe.transform('DATA.DOWNLOAD_ERROR'));
        throw this.DownloadErrorMessage(filetypes);
      });
  }

  onCancelClick(e) {
    this.dismiss({ accepted: false });
  }

  private DownloadErrorMessage(fileTypes: string[]) {
    return new Error(
      'Couldn\'t fetch ' + fileTypes.join(',') + ' for GEOIDs: ' +
      this.exportService.features.map(f => f['properties']['GEOID']).join(',') +
      ' from ' + this.exportService.startYear + ' to ' + this.exportService.endYear
    );
  }

  private dismiss(data) {
    this.buttonClicked.emit({accepted: false });
    this.bsModalRef.hide();
  }

}
