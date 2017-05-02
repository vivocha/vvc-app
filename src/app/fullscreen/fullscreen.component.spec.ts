import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenComponent } from './fullscreen.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {VvcWidgetState} from '../core/core.interfaces';

describe('FullscreenComponent', () => {
  let component: FullscreenComponent;
  let fixture: ComponentFixture<FullscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullscreenComponent, MockTranslate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenComponent);
    component = fixture.componentInstance;
    component.state = {
      chat: true,
      chatVisibility: true,
      closed: false,
      fullScreen: false,
      state: 'ready',
      sharing: false,
      minimized: false,
      mobile: false,
      topBarExpanded: false,
      voice: false,
      video: false,
      mute: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
