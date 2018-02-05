import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { MapToolService } from '../map-tool.service';
import { RoutingService } from '../../services/routing.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.scss']
})
export class EmbedComponent implements OnInit {

  id = 'embed-map';

  constructor(
    public mapToolService: MapToolService,
    private routing: RoutingService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.routing.setActivatedRoute(route);
  }

  ngOnInit() {
    this.routing.getMapRouteData().take(1)
      .subscribe((data) => this.mapToolService.setCurrentData(data));
    this.cdRef.detectChanges();
  }

}
