import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarComponent } from './topbar.component';
import {VvcWidgetState} from '../core/core.interfaces';
import {MockTranslate} from '../_mocks/translate-mock.pipe';



describe('TopbarComponent', () => {
  let comp: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarComponent, MockTranslate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    comp = fixture.componentInstance;
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
    comp.state = state;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

});
