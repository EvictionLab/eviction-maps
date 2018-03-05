import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PipeTransform, Pipe } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/takeUntil';
import { EvictorsComponent } from './evictors.component';
import { UiModule } from '../../../ui/ui.module';
import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { RankingListComponent } from '../../ranking-list/ranking-list.component';
import { RankingUiComponent } from '../../ranking-ui/ranking-ui.component';
import { RankingPanelComponent } from '../../ranking-panel/ranking-panel.component';
import { RankingService } from '../../ranking.service';
import { RankingModule } from '../../ranking.module';
import { ServicesModule } from '../../../services/services.module';



export class TranslateServiceStub {
  public get(key: any): any {
    Observable.of(key);
  }
}

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

export class RankingServiceStub {
  ready = new BehaviorSubject<boolean>(false);
  isReady = this.ready.asObservable();
  loadEvictorsData = () => {};
  setReady = (ready) => {};
}

describe('EvictorsComponent', () => {
  let component: EvictorsComponent;
  let fixture: ComponentFixture<EvictorsComponent>;
  const config = { evictorsUrl: '', cityUrl: '', stateUrl: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        RankingModule.forRoot(config),
        ServicesModule.forRoot()
      ]
    });
    TestBed.overrideComponent(EvictorsComponent, {
      set: {
        providers: [
          { provide: RankingService, useClass: RankingServiceStub },
          { provide: TranslatePipe, useClass: TranslatePipeMock },
          DecimalPipe
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvictorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
