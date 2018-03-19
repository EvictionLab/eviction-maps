import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../../services/search.service';
import { PredictiveSearchComponent } from '../predictive-search/predictive-search.component';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent {
  query: string;
  results: Observable<Object[]>;
  @Input() placeholder;
  @Output() initialInput = new EventEmitter();
  /** Emits a location whenever one is selected in the search */
  @Output() locationSelected = new EventEmitter();

  constructor(public search: SearchService) {
    this.results = Observable.create((observer: any) => {
      this.search.queryGeocoder(this.query)
        .subscribe((results: Object[]) => {
          observer.next(results);
        });
    });
  }

  /**
   * Adds the corresponding layerId to the feature
   * @param feature
   */
  onSearchSelect(data) {
    if (data.selection) {
      this.locationSelected.emit({ feature: data.selection, queryTerm: data.queryTerm });
    }
  }
}
