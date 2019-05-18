import {
  Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, ViewEncapsulation
} from '@angular/core';
import * as pym from 'pym.js';
import { environment } from '../../../../environments/environment';

import { MapToolService } from '../../map-tool.service';
import { RoutingService } from '../../../services/routing.service';
import { PlatformService } from '../../../services/platform.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-embed',
  templateUrl: './card-embed.component.html',
  styleUrls: ['./card-embed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardEmbedComponent implements OnInit, AfterViewInit {
  id = 'card-embed';
  deployUrl = environment.deployUrl;
  mapUrl;

  constructor(
    public mapToolService: MapToolService,
    private routing: RoutingService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    private platform: PlatformService
  ) {
    this.routing.setActivatedRoute(route);
    this.mapToolService.embed = true;
  }

  ngOnInit() {
    this.routing.getMapRouteData().take(1)
      .subscribe((data) => {
        this.mapToolService.setCurrentData(data);
        // Naive replacement of embed in route for map link
        this.mapUrl = this.platform.nativeWindow.location.href.replace('/cards', '');
        this.routing.updatePymSearch();
      });
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    const pymChild = new pym.Child();
    pymChild.sendHeight();
  }
}
