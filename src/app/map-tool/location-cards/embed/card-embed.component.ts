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

const STATE_LOOKUP = {
  "10": {
    "lon": -75.526755,
    "lat": 39.161921,
  },
  "11": {
    "lon": -77.016,
    "lat": 38.905
  },
  "12": {
    "lon": -84.27277,
    "lat": 30.4518,
  },
  "13": {
    "lon": -84.39,
    "lat": 33.76,
  },
  "15": {
    "lon": -157.826182,
    "lat": 21.30895,
  },
  "16": {
    "lon": -116.237651,
    "lat": 43.613739,
  },
  "17": {
    "lon": -89.650373,
    "lat": 39.78325,
  },
  "18": {
    "lon": -86.147685,
    "lat": 39.790942,
  },
  "19": {
    "lon": -93.620866,
    "lat": 41.590939,
  },
  "20": {
    "lon": -95.69,
    "lat": 39.04,
  },
  "21": {
    "lon": -84.86311,
    "lat": 38.197274,
  },
  "22": {
    "lon": -91.140229,
    "lat": 30.45809,
  },
  "23": {
    "lon": -69.765261,
    "lat": 44.323535,
  },
  "24": {
    "lon": -76.501157,
    "lat": 38.972945,
  },
  "25": {
    "lon": -71.0275,
    "lat": 42.2352,
  },
  "26": {
    "lon": -84.5467,
    "lat": 42.7335,
  },
  "27": {
    "lon": -93.094,
    "lat": 44.95,
  },
  "28": {
    "lon": -90.207,
    "lat": 32.32,
  },
  "29": {
    "lon": -92.189283,
    "lat": 38.572954,
  },
  "30": {
    "lon": -112.027031,
    "lat": 46.595805,
  },
  "31": {
    "lon": -96.675345,
    "lat": 40.809868,
  },
  "32": {
    "lon": -119.753877,
    "lat": 39.160949,
  },
  "33": {
    "lon": -71.549127,
    "lat": 43.220093,
  },
  "34": {
    "lon": -74.756138,
    "lat": 40.221741,
  },
  "35": {
    "lon": -105.964575,
    "lat": 35.667231,
  },
  "36": {
    "lon": -73.781339,
    "lat": 42.659829,
  },
  "37": {
    "lon": -78.638,
    "lat": 35.771,
  },
  "38": {
    "lon": -100.779004,
    "lat": 48.813343,
  },
  "39": {
    "lon": -83.000647,
    "lat": 39.962245,
  },
  "40": {
    "lon": -97.534994,
    "lat": 35.482309,
  },
  "41": {
    "lon": -123.029159,
    "lat": 44.931109,
  },
  "42": {
    "lon": -76.875613,
    "lat": 40.269789,
  },
  "44": {
    "lon": -71.422132,
    "lat": 41.82355,
  },
  "45": {
    "lon": -81.035,
    "lat": 34,
  },
  "46": {
    "lon": -100.336378,
    "lat": 44.367966,
  },
  "47": {
    "lon": -86.784,
    "lat": 36.165,
  },
  "48": {
    "lon": -97.75,
    "lat": 30.266667,
  },
  "49": {
    "lon": -111.892622,
    "lat": 40.7547,
  },
  "50": {
    "lon": -72.57194,
    "lat": 44.26639,
  },
  "51": {
    "lon": -77.46,
    "lat": 37.54,
  },
  "53": {
    "lon": -122.893077,
    "lat": 47.042418,
  },
  "54": {
    "lon": -81.633294,
    "lat": 38.349497,
  },
  "55": {
    "lon": -89.384444,
    "lat": 43.074722,
  },
  "56": {
    "lon": -104.802042,
    "lat": 41.145548,
  },
  "01": {
    "lon": -86.279118,
    "lat": 32.361538,
  },
  "02": {
    "lon": -134.41974,
    "lat": 58.301935,
  },
  "04": {
    "lon": -112.073844,
    "lat": 33.448457,
  },
  "05": {
    "lon": -92.331122,
    "lat": 34.736009,
  },
  "06": {
    "lon": -121.468926,
    "lat": 38.555605,
  },
  "08": {
    "lon": -104.984167,
    "lat": 39.7391667,
  },
  "09": {
    "lon": -72.677,
    "lat": 41.767,
  }
}
// Route:
// /cards?year=2016&locations=01,02

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
  parseError = null;

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
        try {
          data.year = data.year || 2016
          data.locations = data.locations.split(',')
            .map(fips => [
                fips, 
                STATE_LOOKUP[fips].lon, 
                STATE_LOOKUP[fips].lat 
              ].join(',')
            )
            .join('+')
          this.mapToolService.setCurrentData(data);
        } catch (e) {
          this.parseError = "Invalid location provided, must be 2 digit fips code.";
        } finally {
          // Naive replacement of embed in route for map link
          this.mapUrl = this.platform.nativeWindow.location.href.replace('/cards', '');
          this.routing.updatePymSearch();
        }
      });
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    const pymChild = new pym.Child();
    pymChild.sendHeight();
  }
}
