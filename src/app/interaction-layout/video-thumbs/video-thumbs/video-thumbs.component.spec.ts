import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { VideoThumbsComponent } from './video-thumbs.component';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('VideoThumbsComponent', () => {
  let component: VideoThumbsComponent;
  let fixture: ComponentFixture<VideoThumbsComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoThumbsComponent ]
    })
    .overrideComponent(VideoThumbsComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoThumbsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a trusted url for videos', () => {
    const url = 'http://trust.me/';
    component.state = {
      video_rx: { url: url }
    };
    fixture.detectChanges();
    const videoRx = de.query(By.css('.remote-video')).nativeElement;
    expect(videoRx.src).toEqual(url);

  });
});
