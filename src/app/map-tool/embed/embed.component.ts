import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map/map.component';

import { MapToolService } from '../map-tool.service';
import { MapService } from '../map/map.service';
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
  @ViewChild(MapComponent) map;

  private defaultMapConfig = {
    style: './assets/style.json',
    center: [-98.5795, 39.8283],
    zoom: 3,
    minZoom: 2,
    maxZoom: 15
  };
  mapConfig: Object;

  constructor(
    public mapToolService: MapToolService,
    private mapService: MapService,
    private routing: RoutingService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.routing.setActivatedRoute(route);
    this.mapToolService.embed = true;
    this.mapToolService.mapConfig = this.defaultMapConfig;
    this.mapConfig = {
      ...this.mapToolService.mapConfig,
      popupProps: [{ label: 'Population', prop: 'p-16' }]
    };
  }

  ngOnInit() {
    // Set minimum zoom to layer minimum
    this.routing.getMapRouteData().take(1)
      .subscribe((data) => {
        const geo = this.mapToolService.dataLevels.find((level) => level.id === data['geo']);
        const mapData = data;
        if (geo && geo['minzoom']) {
          mapData['minzoom'] = geo['minzoom'];
        }
        this.mapToolService.setCurrentData(mapData);
      });
    this.cdRef.detectChanges();
    // Turn off auto-switching so locked into initial layer
    this.map.autoSwitch = false;
  }

}
