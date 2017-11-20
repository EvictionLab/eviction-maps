import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { DataPanelComponent } from './data-panel.component';
import { UiModule } from '../../ui/ui.module';
import { GraphModule } from 'angular-d3-graph/module';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../data/data.service';

describe('DataPanelComponent', () => {
  let component: DataPanelComponent;
  let fixture: ComponentFixture<DataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPanelComponent ],
      imports: [ UiModule, GraphModule.forRoot(), HttpModule ],
      providers: [ {provide: DataService, useValue: {} } ]
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
