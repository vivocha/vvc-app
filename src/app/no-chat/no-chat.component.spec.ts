import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoChatComponent } from './no-chat.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';

describe('NoChatComponent', () => {
  let component: NoChatComponent;
  let fixture: ComponentFixture<NoChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoChatComponent, MockTranslate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoChatComponent);
    component = fixture.componentInstance;
    component.state = { closed: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
