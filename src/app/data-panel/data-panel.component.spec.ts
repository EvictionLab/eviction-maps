import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPanelComponent } from './data-panel.component';
import { MapUiModule } from '../map-ui/map-ui.module';
import { GraphModule } from 'angular-d3-graph/module';

describe('DataPanelComponent', () => {
  let component: DataPanelComponent;
  let fixture: ComponentFixture<DataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPanelComponent ],
      imports: [ MapUiModule, GraphModule.forRoot() ]
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
