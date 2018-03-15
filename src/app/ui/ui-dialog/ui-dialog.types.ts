import { EventEmitter } from '@angular/core';

class DialogContentItem {
    type: string;
    data: any;
}

class DialogConfig {
    title: string;
    content: Array<DialogContentItem>;
    buttons: { ok: boolean, cancel: boolean };
}

class DialogResponse {
    accepted: boolean;
    content?: Array<DialogContentItem>;
}

interface AppDialog {
  buttonClicked: EventEmitter<any>;
  setDialogConfig(config: any);
}

export { DialogConfig, DialogContentItem, DialogResponse, AppDialog };
