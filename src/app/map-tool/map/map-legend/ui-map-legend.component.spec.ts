import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlatformService } from '../../../services/platform.service';
import { UiModule } from '../../../ui/ui.module';

import { UiMapLegendComponent } from './ui-map-legend.component';

describe('UiMapLegendComponent', () => {
  let component: UiMapLegendComponent;
  let fixture: ComponentFixture<UiMapLegendComponent>;
  const bubble = {
    'id': 'er',
    'type': 'bubble',
    'langKey': 'STATS.JUDGMENT_RATE'
  };
  const layer = {
    'id': 'states',
    'name': 'States'
  };
  const choropleth = {
    'id': 'p',
    'type': 'choropleth',
    'langKey': 'STATS.POPULATION',
    'default': 'rgba(0, 0, 0, 0)',
    'order': 6,
    'stops': {
      'states': [
        [-1.0, 'rgba(198, 204, 207, 0.6)'],
        [0, 'rgba(215, 227, 244, 0.7)'],
        [7500000, 'rgba(170, 191, 226, 0.75)'],
        [15000000, 'rgba(133, 157, 204, 0.8)'],
        [22500000, 'rgba(81, 101, 165, 0.85)'],
        [30000000, 'rgba(37, 51, 132, 0.9)']
      ]
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ UiModule, TooltipModule.forRoot(), TranslateModule.forRoot() ],
      declarations: [ UiMapLegendComponent ],
      providers: [ PlatformService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMapLegendComponent);
    component = fixture.componentInstance;
    component.bubbles = bubble;
    component.layer = layer;
    component.choropleth = choropleth;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should format numbers correctly', () => {
    const formatted1 = component.formatValue(100);
    const formatted2 = component.formatValue(5000);
    const formatted3 = component.formatValue(20000);
    const formatted4 = component.formatValue(3456789);
    expect(formatted1).toEqual(100);
    expect(formatted2).toEqual(5000);
    expect(formatted3).toEqual('20k');
    expect(formatted4).toEqual('3.46m');
  });
});
