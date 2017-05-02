import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { DcViewerComponent } from './dc-viewer.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {FormComponent} from '../form/form.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {ReactiveFormsModule} from '@angular/forms';

describe('DcViewerComponent', () => {
  let component: DcViewerComponent;
  let fixture: ComponentFixture<DcViewerComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ DcViewerComponent, FormComponent, MockTranslate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcViewerComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.message = { state: 'open' };
    component.dc = {
      data: [
        { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH'}
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the submit event', fakeAsync(() => {
    let emitted = false;
    component.submit.subscribe( () => emitted = true);
    component.onFormSubmit('submitted');
    tick(2000);
    fixture.detectChanges();
    expect(emitted).toBeTruthy();
  }));

  it('should emit the close viewer event', fakeAsync(() => {
    let emitted = false;
    const closeSpan = de.query(By.css('.back-anchor')).nativeElement;
    component.close.subscribe( () => emitted = true);
    closeSpan.click();
    tick(2000);
    fixture.detectChanges();
    expect(emitted).toBeTruthy();
  }));
});
