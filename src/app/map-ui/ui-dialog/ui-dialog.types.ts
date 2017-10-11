class DialogContentItem {
    type: string;
    data: any;
}

class DialogConfig {
    title: string;
    content: Array<DialogContentItem>;
    buttons: { ok: boolean, cancel: boolean };
}

export { DialogConfig, DialogContentItem };
