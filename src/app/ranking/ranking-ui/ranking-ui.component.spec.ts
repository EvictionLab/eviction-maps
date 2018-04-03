import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { UiModule } from '../../ui/ui.module';
import { RankingUiComponent } from './ranking-ui.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UiSelectComponent } from '../../ui/ui-select/ui-select.component';

import { Pipe, PipeTransform } from '@angular/core';
import { ServicesModule } from '../../services/services.module';

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('RankingUiComponent', () => {
  let component: RankingUiComponent;
  let fixture: ComponentFixture<RankingUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingUiComponent ],
      imports: [ 
        BsDropdownModule.forRoot(), UiModule, TranslateModule.forRoot(), ServicesModule.forRoot() 
      ],
      providers: [ { provide: TranslatePipe, useClass: TranslatePipeMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
