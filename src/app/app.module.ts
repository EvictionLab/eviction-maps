import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SmoothScrollToDirective, SmoothScrollDirective } from 'ng2-smooth-scroll';

import { GraphModule } from 'angular-d3-graph/module';

import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { MapUiModule } from './map-ui/map-ui.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PlatformService } from './platform.service';

@NgModule({
  declarations: [
    AppComponent,
    SmoothScrollToDirective,
    SmoothScrollDirective
  ],
  imports: [
    MapUiModule,
    BrowserModule,
    MapModule,
    GraphModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [ PlatformService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
