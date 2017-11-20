import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { MapToolModule } from '../map-tool/map-tool.module';
import { AceEditorModule } from 'ng2-ace-editor';
import { Ng2FileInputModule } from 'ng2-file-input';

@NgModule({
  imports: [
    CommonModule,
    MapToolModule,
    AceEditorModule,
    Ng2FileInputModule.forRoot({
      dropText: '',
      browseText: 'Load JSON File'
    }),
  ],
  declarations: [ EditorComponent ],
  exports: [ EditorComponent ]
})
export class EditorModule { }
