import { Component, OnInit, Inject, HostListener, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

// return the global native browser window object
function _window(): any { return window; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class.gt-mobile') largerThanMobile: boolean;
  @HostBinding('class.gt-tablet') largerThanTablet: boolean;
  @HostBinding('class.gt-small-desktop') largerThanSmallDesktop: boolean;
  @HostBinding('class.gt-large-desktop') largerThanLargeDesktop: boolean;
  get nativeWindow() { return _window(); }

  /** Sets the size relevant classes on init */
  ngOnInit() { this.onWindowResize(); }

  /** Sets the booleans that determine the classes on the app component */
  @HostListener('window:resize') onWindowResize() {
    const w = this.nativeWindow.innerWidth;
    this.largerThanMobile = (w > 767);
    this.largerThanTablet = (w > 1024);
    this.largerThanSmallDesktop = (w > 1279);
    this.largerThanLargeDesktop = (w > 1599);
  }
}
