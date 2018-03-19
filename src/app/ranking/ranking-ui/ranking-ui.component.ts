import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy
} from '@angular/core';
import { RankingLocation } from '../ranking-location';
import { UiSelectComponent } from '../../ui/ui-select/ui-select.component';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-ranking-ui',
  templateUrl: './ranking-ui.component.html',
  styleUrls: ['./ranking-ui.component.scss']
})
export class RankingUiComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() locationList: Array<RankingLocation>;
  @Input() regions; // Array of regions (states) to filter by
  @Input() areaTypes; // Array of area types (rural, mid-sized, etc)
  @Input() dataProperties; // Array of data properties to sort by
  @Output() selectedLocationChange = new EventEmitter<any>();
  @Input() selectedAreaType;
  @Output() selectedAreaTypeChange = new EventEmitter<any>();
  @Input() selectedDataProperty;
  @Output() selectedDataPropertyChange = new EventEmitter<any>();
  @Input() selectedRegion;
  @Output() selectedRegionChange = new EventEmitter<string>();
  @Output() applyFilters = new EventEmitter<any>();
  @Output() clearFilters = new EventEmitter<any>();
  @Output() closePanel = new EventEmitter<any>();
  @ViewChild('dataSelect') dataPropSelect: UiSelectComponent;
  private destroy = new Subject<any>();

  constructor(public el: ElementRef) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  ngAfterViewInit() {
    // bring the z-index of the panel up when the data property dropdown opens
    if (this.dataPropSelect) {
      this.dataPropSelect.dropdown.isOpenChange
        .takeUntil(this.destroy)
        .subscribe(isOpen => {
          this.togglePanelOnTop(isOpen);
        });
    }
  }

  /** Boost the z-index of the panel so it is above other elements */
  private togglePanelOnTop(moveOnTop: boolean) {
    if (moveOnTop) {
      this.el.nativeElement.parentElement.style.zIndex = 997;
    } else {
      this.el.nativeElement.parentElement.style.zIndex = null;
    }
  }

}
