import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { UiModule } from '../../ui/ui.module';
import { ServicesModule } from '../../services/services.module';
import { RankingService } from '../ranking.service';
import { ScrollService } from '../../services/scroll.service';
import { RankingToolComponent } from './ranking-tool.component';
import { RankingUiComponent } from '../ranking-ui/ranking-ui.component';
import { RankingListComponent } from '../ranking-list/ranking-list.component';
import { RankingPanelComponent } from '../ranking-panel/ranking-panel.component';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

@Pipe({ name: 'decimal' })
export class DecimalPipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('RankingToolComponent', () => {
  let component: RankingToolComponent;
  let fixture: ComponentFixture<RankingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RankingToolComponent,
        RankingUiComponent,
        RankingListComponent,
        RankingPanelComponent
      ],
      imports: [
        UiModule, RouterTestingModule, ServicesModule.forRoot(), TranslateModule.forRoot(),
        PopoverModule.forRoot()
      ]
    });
    TestBed.overrideComponent(RankingToolComponent, {
      set: {
        providers: [
          {
            provide: RankingService, useValue: {
              loadCsvData: () => { },
              isReady: { subscribe: () => { } }
            }
          },
          { provide: TranslatePipe, useClass: TranslatePipeMock },
          { provide: DecimalPipe, useClass: DecimalPipeMock },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
