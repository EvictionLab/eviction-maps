import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSocialShareComponent } from './ui-social-share.component';
import { UiModule } from '../ui.module';
import { ServicesModule } from '../../services/services.module';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';

describe('UiSocialShareComponent', () => {
  let component: UiSocialShareComponent;
  let fixture: ComponentFixture<UiSocialShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ UiModule, ServicesModule.forRoot(), TranslateModule.forRoot() ],
      providers: [ TranslatePipe, ChangeDetectorRef ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSocialShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
