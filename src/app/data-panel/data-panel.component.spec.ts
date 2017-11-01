import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPanelComponent } from './data-panel.component';
import { MapUiModule } from '../map-ui/map-ui.module';
import { GraphModule } from 'angular-d3-graph/module';
import { LocationCardsComponent } from '../location-cards/location-cards.component';
import { SearchService } from '../search/search.service';
import { Observable } from 'rxjs/Observable';


describe('DataPanelComponent', () => {
  let component: DataPanelComponent;
  let fixture: ComponentFixture<DataPanelComponent>;
  const searchServiceStub = {
    queryGeocoder: () => {},
    getLayerName: () => {},
    getTileData: () => {},
    query: '',
    tilesetYears: ['90', '00', '10'],
    apiKey: 'mapzen-FgUaZ97',
    mapzenParams: [
      'sources=whosonfirst,openstreetmap',
      'layers=address,localadmin,locality,county,region,postalcode',
      'boundary.country=USA',
      'api_key=' + this.apiKey
    ],
    mapzenBase: 'https://search.mapzen.com/v1/autocomplete?',
    tileBase: 'https://s3.us-east-2.amazonaws.com/eviction-lab-tilesets/fixtures/',
    maxZoom: 10,
    results: new Observable<Object[]>()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPanelComponent, LocationCardsComponent ],
      imports: [ MapUiModule, GraphModule.forRoot() ],
      providers: [ { provide: SearchService, useValue: searchServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
