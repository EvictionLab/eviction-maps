import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { HeaderBarComponent  } from './header-bar/header-bar.component';
import { MapToolComponent } from './map-tool.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MapModule } from './map/map.module';
import { HttpModule } from '@angular/http';
import { DataPanelModule } from './data-panel/data-panel.module';
import { UiModule } from '../ui/ui.module';
import { DataService } from '../data/data.service';
import { TranslateService, TranslateModule, TranslatePipe } from '@ngx-translate/core';


export class TranslateServiceStub{
  public get(key: any): any {
    Observable.of(key);
  }
}

describe('MapToolComponent', () => {
  let component: MapToolComponent;
  let fixture: ComponentFixture<MapToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapToolComponent, HeaderBarComponent ],
      imports: [
        UiModule,
        DataPanelModule,
        MapModule,
        Ng2PageScrollModule,
        HttpModule,
        RouterTestingModule,
        TranslateModule
      ],
      providers: [DataService, {provide: TranslateService, useClass: TranslateServiceStub}]
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
