import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphModule } from 'angular-d3-graph/module';
import { UiModule } from '../ui/ui.module';

import { EvictionGraphsComponent } from './eviction-graphs.component';

import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { EvictionGraphsModule } from './eviction-graphs.module';
import { GraphService } from './graph.service';
import { ServicesModule } from '../services/services.module';

@Pipe({ name: 'translate' })
export class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('EvictionGraphsComponent', () => {
  let component: EvictionGraphsComponent;
  let fixture: ComponentFixture<EvictionGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ServicesModule.forRoot(),
        GraphModule.forRoot(),
        EvictionGraphsModule,
        TranslateModule.forRoot(),
        UiModule
      ],
    });
    TestBed.overrideComponent(EvictionGraphsComponent, {
      set: {
        providers: [
          { provide: TranslatePipe, useClass: TranslatePipeMock },
          TranslateService,
          GraphService
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvictionGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
