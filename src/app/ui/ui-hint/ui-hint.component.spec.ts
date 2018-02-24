import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { UiHintComponent } from './ui-hint.component';
import { UiModule } from '../../ui/ui.module';

describe('UiHintComponent', () => {
  let component: UiHintComponent;
  let fixture: ComponentFixture<UiHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TooltipModule.forRoot(), UiModule ],
      declarations: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
