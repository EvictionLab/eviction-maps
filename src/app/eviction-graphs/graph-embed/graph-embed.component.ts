import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-graph-embed',
  templateUrl: './graph-embed.component.html',
  styleUrls: ['./graph-embed.component.scss']
})
export class GraphEmbedComponent implements OnInit {

  graphData;
  graphSettings;
  tooltips;

  ngOnInit() {}

}
