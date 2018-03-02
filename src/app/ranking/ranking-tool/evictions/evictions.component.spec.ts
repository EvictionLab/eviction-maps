import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvictionsComponent } from './evictions.component';

describe('EvictionsComponent', () => {
  let component: EvictionsComponent;
  let fixture: ComponentFixture<EvictionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvictionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
