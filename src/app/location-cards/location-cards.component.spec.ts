import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule, TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { LocationCardsComponent } from './location-cards.component';
import { PredictiveSearchComponent } from '../map-ui/predictive-search/predictive-search.component';
import { SearchService } from '../search/search.service';

describe('LocationCardsComponent', () => {
  let component: LocationCardsComponent;
  let fixture: ComponentFixture<LocationCardsComponent>;
  const searchServiceStub = {
    queryGeocoder: () => {},
    getLayerName: () => {},
    getTileData: () => {},
    query: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCardsComponent, PredictiveSearchComponent ],
      imports: [ FormsModule, TypeaheadModule.forRoot() ],
      providers: [ {provide: SearchService, useValue: searchServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
