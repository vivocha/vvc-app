import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimizedComponent } from './minimized.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('MinimizedComponent', () => {
  let comp: MinimizedComponent;
  let fixture: ComponentFixture<MinimizedComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimizedComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should create', () => {
    comp.state = { not_read: 0 };
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should show the agent avatar if available', () => {
    comp.state = { not_read: 0, agent: {
     avatar: { images: [ { file: 'filename'}], base_url: 'baseurl'}
    }};
    fixture.detectChanges();
    const imgAvatar = de.query(By.css('img')).nativeElement;
    const avatarUrl = comp.state.agent.avatar.base_url + comp.state.agent.avatar.images[0].file;
    expect(imgAvatar.src).toContain(avatarUrl);
  });

  it('should show not read messages', () => {
    comp.state = { not_read: 1 };
    fixture.detectChanges();
    const badge = de.query(By.css('.badge')).nativeElement;
    expect(parseInt(badge.innerHTML, 0)).toEqual(comp.state.not_read);
  });

  it('should not show the messages badge if the not read messages is 0', () => {
    comp.state = { not_read: 0 };
    fixture.detectChanges();
    const badge = de.query(By.css('.badge'));
    expect(badge).toBeNull();
  });

});
