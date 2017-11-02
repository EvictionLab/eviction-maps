import { Component, ViewChild, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

}
