import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { HeaderBarComponent } from './header-bar.component';
import { UiModule } from '../../ui/ui.module';
import { By } from '@angular/platform-browser';

describe('HeaderBarComponent', () => {
  let component: HeaderBarComponent;
  let fixture: ComponentFixture<HeaderBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderBarComponent ],
      imports: [ UiModule, HttpModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should activate and emit clicked menu items', fakeAsync(() => {
      let subscribeVal;
      fixture.detectChanges();
      tick();
      component.selectMenuItem.subscribe((val: any) => { subscribeVal = val; });
      const button = fixture.debugElement.query(By.css('.el-button-map'));
      button.triggerEventHandler('click', null);
      fixture.detectChanges();
      tick();
      expect(component.activeMenuItem).toEqual('map');
      expect(button.nativeElement.className).toContain('active');
      expect(subscribeVal).toEqual('map');
    })
  );
});
