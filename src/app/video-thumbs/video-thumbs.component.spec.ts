import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoThumbsComponent } from './video-thumbs.component';

describe('VideoThumbsComponent', () => {
  let component: VideoThumbsComponent;
  let fixture: ComponentFixture<VideoThumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoThumbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoThumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
