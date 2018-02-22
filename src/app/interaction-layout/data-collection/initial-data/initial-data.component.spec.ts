import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialDataComponent } from './initial-data.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MockTranslate} from '../_mocks/translate-mock.pipe';

describe('InitialDataComponent', () => {
  let component: InitialDataComponent;
  let fixture: ComponentFixture<InitialDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialDataComponent, MockTranslate ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
