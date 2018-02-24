import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RankingPanelComponent } from './ranking-panel.component';
import { UiModule } from '../../ui/ui.module';


describe('RankingPanelComponent', () => {
  let component: RankingPanelComponent;
  let fixture: ComponentFixture<RankingPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot(), UiModule ],
      declarations: [ RankingPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
