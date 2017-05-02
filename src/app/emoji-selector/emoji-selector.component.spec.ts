import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { EmojiSelectorComponent } from './emoji-selector.component';

describe('EmojiSelectorComponent', () => {
  let component: EmojiSelectorComponent;
  let fixture: ComponentFixture<EmojiSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmojiSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an event when addEmoji is called', fakeAsync(() => {
    let emitted = false;
    component.emoji.subscribe( () => emitted = true);
    component.addEmoji('any');
    tick(2000);
    fixture.detectChanges();
    expect(emitted).toBeTruthy();
  }));
});
