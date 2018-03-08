import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureOverviewComponent } from './feature-overview.component';
import { NgxCarousel, NgxCarouselModule } from 'ngx-carousel';
import { UiModule } from '../../ui/ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

describe('FeatureOverviewComponent', () => {
  let component: FeatureOverviewComponent;
  let fixture: ComponentFixture<FeatureOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxCarouselModule,
        UiModule,
        TranslateModule.forRoot(),
        ModalModule.forRoot()
      ],
      declarations: [ FeatureOverviewComponent ],
      providers: [ BsModalService, BsModalRef ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
