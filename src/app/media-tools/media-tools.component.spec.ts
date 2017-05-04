import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaToolsComponent } from './media-tools.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {VvcWidgetState} from '../core/core.interfaces';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('MediaToolsComponent', () => {
  let component: MediaToolsComponent;
  let fixture: ComponentFixture<MediaToolsComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaToolsComponent, MockTranslate ]
    })
    .overrideComponent(MediaToolsComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaToolsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    const state: VvcWidgetState = {
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
      video: false

    };
    component.state = state;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set trusted url for media tags', () => {
    const url = 'http://trust.me/';
    component.state.video_rx = { url: url };
    fixture.detectChanges();
    const videoRx = de.query(By.css('.big-video')).nativeElement;
    expect(videoRx.src).toEqual(url);
  });

  it('should set the timer for audio call properly', () => {
    component.setTime(1);
    fixture.detectChanges();
    expect(component.theTimer.nativeElement.innerHTML).toEqual('00:00:01');
  });
});
