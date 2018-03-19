import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCloseButtonComponent } from './ui-close-button.component';
import { UiModule } from '../ui.module';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('UiCloseButtonComponent', () => {
  let component: UiCloseButtonComponent;
  let fixture: ComponentFixture<UiCloseButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [UiModule],
      providers: [ { provide: TranslatePipe, useClass: TranslatePipeMock }]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCloseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
