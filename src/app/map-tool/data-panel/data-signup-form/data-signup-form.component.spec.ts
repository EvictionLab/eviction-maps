import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { UiModule } from '../../../ui/ui.module';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { DataSignupFormComponent } from './data-signup-form.component';
import { AnalyticsService } from '../../../services/analytics.service';


@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

export class FileExportStub {
  getFileTypes() {
    return [
      { name: 'Excel', value: 'xlsx', path: '/format/xlsx', checked: false },
      { name: 'PowerPoint', value: 'pptx', path: '/format/pptx', checked: false },
      { name: 'PDF', value: 'pdf', path: '/pdf', checked: false }
    ];
  }
  setExportValues(...args) {}
  sendFileRequest(...args) {
    return { subscribe: (...sArgs) => {} };
  }
}

describe('DataSignupFormComponent', () => {
  let component: DataSignupFormComponent;
  let fixture: ComponentFixture<DataSignupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        UiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ DataSignupFormComponent ],
      providers: [ BsModalService, BsModalRef ]
    });
    TestBed.overrideComponent(DataSignupFormComponent, {
      set: {
        providers: [
          { provide: TranslatePipe, useClass: TranslatePipeMock },
          { provide: AnalyticsService, useValue: { trackEvent: () => {} }}
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
