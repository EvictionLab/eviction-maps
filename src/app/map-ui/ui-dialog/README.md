# UI Dialog

## Usage
Dialogs are created using the `UiDialogService`.  Add the provider to your component or module, then initialize your component with the UiDialogService

```ts
import { UiDialogService } from './ui-dialog.service';

constructor(public dialogService: UiDialogService) { ... }

showDialog() {
    const dialogClose = this.dialogService.showDialog({
        title: 'Are you sure?',
        content: 'Click OK to confirm the action.',
        buttons: { ok: true, cancel: true }
    });
    dialogClose.subscribe((response) => {
        if (response.accepted) { doSomething(); }
    })
}
```

### Methods

`showDialog(string | DialogContentItem | DialogConfig)`

    - Returns an observable that you can subscribe to.  Fires when the dialog dismisses.

Displays a dialog with the provided content string, content item, or dialog configuration.

### DialogConfig

The dialog config is an object that consists of a title, content, and buttons.

```ts
{
    title: string;
    content: Array<DialogContentItem>;
    buttons: { ok: boolean, cancel: boolean };
}
```


### DialogContentItem

Currently you can create dialog content with text or checkboxes.

Sample text `DialogContentItem`:
```ts
{ type: 'text', data: 'a message to display in the dialog' }
```

Sample checkbox `DialogContentItem`:
```ts
{ type: 'checkbox', data: { } }
```