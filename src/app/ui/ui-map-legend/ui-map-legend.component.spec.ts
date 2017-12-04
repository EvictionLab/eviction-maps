import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { UiMapLegendComponent } from './ui-map-legend.component';
import { UiHintComponent } from '../ui-hint/ui-hint.component';

describe('UiMapLegendComponent', () => {
  let component: UiMapLegendComponent;
  let fixture: ComponentFixture<UiMapLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TooltipModule.forRoot(), TranslateModule.forRoot() ],
      declarations: [ UiMapLegendComponent, UiHintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMapLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
