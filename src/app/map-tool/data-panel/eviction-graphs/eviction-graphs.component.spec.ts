import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphModule } from 'angular-d3-graph/module';
import { UiModule } from '../../../ui/ui.module';

import { EvictionGraphsComponent } from './eviction-graphs.component';

import { TranslateModule, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';

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
      imports: [GraphModule.forRoot(), TranslateModule.forRoot(), UiModule ],
      declarations: [EvictionGraphsComponent]
    });
    TestBed.overrideComponent(EvictionGraphsComponent, {
      set: {
        providers: [
          { provide: TranslatePipe, useClass: TranslatePipeMock },
          TranslateService
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
