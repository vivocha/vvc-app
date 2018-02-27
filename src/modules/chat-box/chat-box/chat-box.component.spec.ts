import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ChatBoxComponent } from './chat-box.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {By} from '@angular/platform-browser';

describe('ChatBoxComponent', () => {
  let component: ChatBoxComponent;
  let fixture: ComponentFixture<ChatBoxComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBoxComponent, MockTranslate ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open emoji panel when emoji button clicked', () => {
    const emojiButton = de.query(By.css('.vvc-smile')).nativeElement;
    emojiButton.click();
    fixture.detectChanges();
    expect(component.emojiPanel).toBeTruthy();
  });

  it('should open upload panel when upload button clicked', () => {
    const uploadButton = de.query(By.css('.vvc-clipboard')).nativeElement;
    uploadButton.click();
    fixture.detectChanges();
    expect(component.uploadPanel).toBeTruthy();
  });

  it('should close all panels at once if needed', () => {
    component.uploadPanel = true;
    component.emojiPanel = true;
    fixture.detectChanges();
    component.closeAllPanels();
    fixture.detectChanges();
    expect(component.uploadPanel).toBeFalsy();
    expect(component.emojiPanel).toBeFalsy();
  });

  it('should emit a send event when sendMessage is called', fakeAsync(() => {
    const textArea = de.query(By.css('textarea')).nativeElement;
    let fired = false;
    component.message.subscribe( () => fired = true);
    textArea.value = 'test';
    textArea.dispatchEvent(new Event('keyup'));
    component.sendMessage(textArea);
    tick(2000);
    fixture.detectChanges();
    expect(fired).toBeTruthy();
  }));

});
