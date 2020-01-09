import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';


import { EmbedComponent } from './embed.component';
import { MapModule } from '../map/map.module';
import { ServicesModule } from '../../services/services.module';
import { ScrollService } from '../../services/scroll.service';
import { MapToolService } from '../map-tool.service';
import { PlatformService } from '../../services/platform.service';
import { LocationCardsComponent } from '../location-cards/location-cards.component';

describe('EmbedComponent', () => {
  let component: EmbedComponent;
  let fixture: ComponentFixture<EmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbedComponent ],
      imports: [
        MapModule,
        RouterTestingModule,
        ServicesModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        MapToolService, PlatformService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
