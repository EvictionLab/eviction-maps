import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvictorsComponent } from './evictors.component';

describe('EvictorsComponent', () => {
  let component: EvictorsComponent;
  let fixture: ComponentFixture<EvictorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvictorsComponent ]
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
