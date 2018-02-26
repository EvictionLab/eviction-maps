import {
  Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, ViewEncapsulation
} from '@angular/core';
import { MapComponent } from '../map/map/map.component';
import * as pym from 'pym.js';

import { MapToolService } from '../map-tool.service';
import { MapService } from '../map/map.service';
import { RoutingService } from '../../services/routing.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmbedComponent implements OnInit, AfterViewInit {
  id = 'embed-map';
  @ViewChild(MapComponent) map;

  private defaultMapConfig = {
    style: './assets/style.json',
    center: [-98.5795, 39.8283],
    zoom: 3,
    minZoom: 2,
    maxZoom: 15,
    popupProps: []
  };
  mapConfig: Object;

  constructor(
    public mapToolService: MapToolService,
    private mapService: MapService,
    private routing: RoutingService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private el: ElementRef
  ) {
    this.routing.setActivatedRoute(route);
    this.mapToolService.embed = true;
    this.mapConfig = this.defaultMapConfig;
  }

  ngOnInit() {
    // Set minimum zoom to layer minimum
    this.routing.getMapRouteData().take(1)
      .subscribe((data) => {
        const geo = this.mapToolService.dataLevels.find((level) => level.id === data['geo']);
        const choro = this.mapToolService.dataAttributes.find(a => a.id === data['choropleth']);
        const bubble = this.mapToolService.dataAttributes.find(a => a.id === data['type']);
        const mapData = data;
        if (geo && geo['minzoom']) { mapData['minzoom'] = geo['minzoom']; }
        if (choro) { this.mapConfig['popupProps'].push(choro); }
        if (bubble) { this.mapConfig['popupProps'].push(bubble); }
        this.mapConfig['year'] = data['year'];
        this.mapToolService.setCurrentData(mapData);
        this.mapConfig = { ...this.mapConfig, ...this.mapToolService.mapConfig };
        this.routing.updatePymSearch();
      });
    this.cdRef.detectChanges();
    // Turn off auto-switching so locked into initial layer
    this.map.autoSwitch = false;
  }

  ngAfterViewInit() {
    const pymChild = new pym.Child();
    pymChild.sendHeight();
  }

}
