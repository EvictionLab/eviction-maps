import { Component, OnInit } from '@angular/core';

import { MapToolService } from '../map-tool.service';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.scss']
})
export class EmbedComponent implements OnInit {

  constructor(public mapToolService: MapToolService) { }

  ngOnInit() {
  }

}
