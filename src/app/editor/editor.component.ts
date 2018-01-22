import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MapToolComponent } from '../map-tool/map-tool.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  styleJson;
  downloadUrl;
  editorActive = true;
  mapStyle = '[ "loading" ]';
  @ViewChild('editor') editor;
  @ViewChild(MapToolComponent) mapTool;
  private _mapRef;

  constructor(private sanitizer: DomSanitizer) { }

  ngAfterViewInit() {
    this.editor.nativeElement.env.editor.getSession().setMode('ace/mode/json');
    this.mapTool.mapReady.subscribe((m) => {
      this.mapStyle = JSON.stringify(m.getStyle(), null, '\t');
      this._mapRef = m;
    });
  }

  updateStyle(e) {
    try {
      const strippedJson = e.replace(/\/\*.*\*\//g, '');
      const json = JSON.parse(strippedJson);
      this._mapRef.setStyle(json, { diff: false });
      this.downloadUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(new Blob([strippedJson], {type: 'application/json'}))
      );
    } catch (e) {
      console.warn('Style Update Error', e);
    }
  }

  onStyleAdded(e) {
    const reader = new FileReader();
    // Closure to capture the file information.
    const mapRef = this._mapRef;
    const _this = this;
    reader.onload = (function(theFile) {
      return function(ev) {
        // Render thumbnail.
        const JsonObj = JSON.parse(ev.target.result);
        mapRef.setStyle(JsonObj, { diff: false });
        _this.mapStyle = JSON.stringify(JsonObj, null, '\t');
      };
    })(e.file);
    // Read in the image file as a data URL.
    reader.readAsText(e.file);
  }

  toggleEditor(e) {
    this.editorActive = !this.editorActive;
    const interval = setInterval(() => { this._mapRef.resize(); }, 10);
    setTimeout(() => { clearInterval(interval); }, 200);
  }

}
