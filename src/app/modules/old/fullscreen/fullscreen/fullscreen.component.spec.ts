import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { FullscreenComponent } from './fullscreen.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {VvcWidgetState} from '../core/core.interfaces';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('FullscreenComponent', () => {
  let component: FullscreenComponent;
  let fixture: ComponentFixture<FullscreenComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullscreenComponent, MockTranslate ]
    })
    .overrideComponent(FullscreenComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
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
      voice: true,
      video: true,
      mute: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a trusted url for videos', () => {
    const url = 'http://trust.me/';
    component.state.video_rx = { url: url };
    fixture.detectChanges();
    const videoRx = de.query(By.css('.big-video')).nativeElement;
    expect(videoRx.src).toEqual(url);
  });

  it('should emit chat visibility when visibility button is clicked', fakeAsync(() => {
    let emitted = false;
    component.showchat.subscribe( () => emitted = true);
    component.chatToggle();
    tick(2000);
    fixture.detectChanges();
    expect(emitted).toBeTruthy();
  }));
});
