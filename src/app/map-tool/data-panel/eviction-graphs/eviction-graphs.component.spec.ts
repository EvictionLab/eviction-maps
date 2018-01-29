import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvictionGraphsComponent } from './eviction-graphs.component';

describe('EvictionGraphsComponent', () => {
  let component: EvictionGraphsComponent;
  let fixture: ComponentFixture<EvictionGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvictionGraphsComponent ]
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
