import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { TopbarComponent } from './topbar.component';
import {VvcWidgetState} from '../core/core.interfaces';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';



describe('TopbarComponent', () => {
  let comp: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarComponent, MockTranslate ]
    })
    .overrideComponent(TopbarComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    comp = fixture.componentInstance;
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
      video: false,
      canAddVideo: true,
      localCaps: {
        WebRTC : {
          AudioCapture : true,
          VideoCapture: true
        }
      },
      remoteCaps: {
        WebRTC : {
          AudioCapture: true,
          VideoCapture: true
        },
        MediaAvailability : {
          Video: true
        }
      },
      agent: {
        user: 'marchitos',
        nick: 'marchitos',
        avatar: { images: [ { file: 'filename'}], base_url: 'baseurl'}
      }

    };
    comp.state = state;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set the agent avatar', () => {
    const imgAvatar = de.query(By.css('img')).nativeElement;
    const avatarUrl = comp.state.agent.avatar.base_url + comp.state.agent.avatar.images[0].file;
    expect(imgAvatar.src).toContain(avatarUrl);
  });

  it('should set the default agent avatar if avatar is not set', () => {
    delete comp.state.agent.avatar;
    fixture.detectChanges();
    const baseImgAvatar = 'assets/acct-img.png';
    const imgAvatar = de.query(By.css('img')).nativeElement;
    expect(imgAvatar.src).toContain(baseImgAvatar);
  });

  it('should set the agent nickname', () => {
    expect(comp.getAgentName()).toEqual(comp.state.agent.nick);
  });

  it('should be able to let user to ask for media upgrade if allowed', fakeAsync(() => {
    let emitted = false;
    comp.upgrade.subscribe( () => emitted = true);
    comp.askForUpgrade('voice');
    tick(2000);
    fixture.detectChanges();
    expect(emitted).toBeTruthy();
  }));

});
