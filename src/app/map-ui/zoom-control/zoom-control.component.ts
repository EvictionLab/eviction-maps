import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-zoom-control',
  templateUrl: './zoom-control.component.html',
  styleUrls: ['./zoom-control.component.css']
})
export class ZoomControlComponent implements OnInit {
  @Input() zoom: number;
  @Input() minZoom: number;
  @Input() maxZoom: number;
  @Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() { }

  changeZoom(newZoom: number) {
    this.zoom = +newZoom;
    this.zoomChange.emit(+newZoom);
  }

}
