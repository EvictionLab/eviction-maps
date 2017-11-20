import { Component, ViewChild, AfterViewInit, OnInit, Inject, HostListener, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { PlatformService } from './platform.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  // sandbox
  mapInstance;
  styleJson;
  downloadUrl;
  editorActive = true;
  @ViewChild('editor') editor;

  @HostBinding('class.gt-mobile') largerThanMobile: boolean;
  @HostBinding('class.gt-tablet') largerThanTablet: boolean;
  @HostBinding('class.gt-small-desktop') largerThanSmallDesktop: boolean;
  @HostBinding('class.gt-large-desktop') largerThanLargeDesktop: boolean;

  constructor(
    private platform: PlatformService,
    private sanitizer: DomSanitizer
  ) {}

  /** Sets the size relevant classes on init */
  ngOnInit() { this.onWindowResize(); }

  /** Sets the booleans that determine the classes on the app component */
  @HostListener('window:resize') onWindowResize() {
    this.largerThanMobile = this.platform.isLargerThanMobile;
    this.largerThanTablet = this.platform.isLargerThanTablet;
    this.largerThanSmallDesktop = this.platform.isLargerThanSmallDesktop;
    this.largerThanLargeDesktop = this.platform.isLargerThanLargeDesktop;
  }

  ngAfterViewInit() {
    this.editor.nativeElement.env.editor.getSession().setMode('ace/mode/json');
  }

  onStyleAdded(e) {
    const reader = new FileReader();
    const mapRef = this.mapInstance;
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(ev) {
        // Render thumbnail.
        const JsonObj = JSON.parse(ev.target.result);
        mapRef.setStyle(JsonObj, { diff: false });
      };
    })(e.file);
    // Read in the image file as a data URL.
    reader.readAsText(e.file);
  }

  updateStyle(e) {
    try {
      const strippedJson = e.replace(/\/\*.*\*\//g, '');
      const json = JSON.parse(strippedJson);
      this.mapInstance.setStyle(json, { diff: false });
      this.downloadUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(new Blob([strippedJson], {type: 'application/json'}))
      );
    } catch (e) {
      console.warn('Style Update Error', e);
    }
  }

  toggleEditor(e) {
    this.editorActive = !this.editorActive;
    const mapRef = this.mapInstance;
    const interval = setInterval(() => { mapRef.resize(); }, 10);
    setTimeout(() => { clearInterval(interval); }, 200);
  }
}
