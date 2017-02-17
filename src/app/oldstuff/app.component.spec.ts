/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {VvcService} from './core/vvc.service';
import {TranslateService, TranslateLoader, TranslateParser} from 'ng2-translate';
import {CoreModule} from './core/core.module';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [VvcService, TranslateService, TranslateLoader, TranslateParser]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
