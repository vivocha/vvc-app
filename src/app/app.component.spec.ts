import {TestBed, async, ComponentFixture} from '@angular/core/testing';

import { AppComponent } from './app.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {WindowRef} from './core/window.service';
import {VvcContactService} from './core/contact.service';
import {VvcDataCollectionService} from './core/dc.service';
import {Store} from '@ngrx/store';
import {CoreModule} from './core/core.module';
import {TranslateModule} from '@ngx-translate/core';
import {VvcWidgetState} from './core/core.interfaces';
import {By} from '@angular/platform-browser';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        TranslateModule.forRoot()],
      declarations: [ AppComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show the minimized component if minimize is set', () => {
    const state: VvcWidgetState = {
      chat: true,
      chatVisibility: true,
      closed: false,
      fullScreen: false,
      state: 'ready',
      sharing: false,
      minimized: true,
      mobile: false,
      topBarExpanded: false,
      voice: false,
      video: false
    };
    component.widgetState = state;
    fixture.detectChanges();
    const minimizedComponent = de.query(By.css('#vvc-minimized'));
    expect(minimizedComponent).toBeTruthy();
  });

  it('should show the fullscreen component if fullScreen is set', () => {
    const state: VvcWidgetState = {
      chat: true,
      chatVisibility: true,
      closed: false,
      fullScreen: true,
      state: 'ready',
      sharing: false,
      minimized: true,
      mobile: false,
      topBarExpanded: false,
      voice: true,
      video: true
    };
    component.widgetState = state;
    fixture.detectChanges();
    const minimizedComponent = de.query(By.css('#vvc-minimized'));
    expect(minimizedComponent).toBeTruthy();
  });


});
