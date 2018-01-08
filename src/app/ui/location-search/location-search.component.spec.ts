import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LocationSearchComponent } from './location-search.component';
import { PredictiveSearchComponent } from '../predictive-search/predictive-search.component';
import { TypeaheadModule, TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { SearchService } from './search/search.service';

describe('LocationSearchComponent', () => {
  let component: LocationSearchComponent;
  let fixture: ComponentFixture<LocationSearchComponent>;
  const searchServiceStub = {
    queryGeocoder: () => {},
    getLayerName: () => {},
    query: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSearchComponent, PredictiveSearchComponent ],
      imports: [ FormsModule, TypeaheadModule.forRoot() ]
    });
    TestBed.overrideComponent(LocationSearchComponent, {
      set: {
        providers: [ {provide: SearchService, useValue: searchServiceStub } ],
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
