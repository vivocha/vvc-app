import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { IncDcComponent } from './inc-dc.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('IncDcComponent', () => {
  let component: IncDcComponent;
  let fixture: ComponentFixture<IncDcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncDcComponent, MockTranslate ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncDcComponent);
    component = fixture.componentInstance;
    component.message = { state: 'open' };
    component.dc = { mode: 'inline' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the submit event', fakeAsync(() => {
    let emitted = false;
    component.submit.subscribe( () => emitted = true);
    component.onInlineSubmit('submitted');
    tick(2000);
    fixture.detectChanges();
    expect(emitted).toBeTruthy();
  }));
});
