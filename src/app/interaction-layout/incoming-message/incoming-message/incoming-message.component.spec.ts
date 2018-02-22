import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingMessageComponent } from './incoming-message.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';

describe('IncomingMessageComponent', () => {
  let component: IncomingMessageComponent;
  let fixture: ComponentFixture<IncomingMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingMessageComponent, MockTranslate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingMessageComponent);
    component = fixture.componentInstance;
    component.message = { state: 'open' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
