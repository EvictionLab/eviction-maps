import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { MapToolComponent } from './map-tool.component';
import { MapModule } from './map/map.module';
import { HttpModule } from '@angular/http';
import { DataPanelModule } from './data-panel/data-panel.module';
import { UiModule } from '../ui/ui.module';
import { DataService } from '../data/data.service';

describe('MapToolComponent', () => {
  let component: MapToolComponent;
  let fixture: ComponentFixture<MapToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapToolComponent ],
      imports: [
        UiModule,
        DataPanelModule,
        MapModule,
        Ng2PageScrollModule,
        HttpModule,
        RouterTestingModule
      ],
      providers: [DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
