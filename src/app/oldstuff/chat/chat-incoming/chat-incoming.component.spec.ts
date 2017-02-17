/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChatIncomingComponent } from './chat-incoming.component';

describe('ChatIncomingComponent', () => {
  let component: ChatIncomingComponent;
  let fixture: ComponentFixture<ChatIncomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatIncomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
