import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFormComponent } from './download-form.component';

describe('DownloadFormComponent', () => {
  let component: DownloadFormComponent;
  let fixture: ComponentFixture<DownloadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
