import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaToolsComponent } from './media-tools.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {VvcWidgetState} from '../core/core.interfaces';

describe('MediaToolsComponent', () => {
  let component: MediaToolsComponent;
  let fixture: ComponentFixture<MediaToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaToolsComponent, MockTranslate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaToolsComponent);
    component = fixture.componentInstance;
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
});
