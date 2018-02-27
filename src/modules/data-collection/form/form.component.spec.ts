import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { FormComponent } from './form.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';
import {ReactiveFormsModule} from '@angular/forms';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ FormComponent, MockTranslate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    component.dc = {
      data: [
        { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH'},
        { id: 'email', name: 'DC.D1.EMAIL', type: 'email', required: true, placeholder: 'DC.D1.EMAIL_PH'}
      ]
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit submit event on submit', fakeAsync(() => {
    let emitted = false;
    component.submit.subscribe( () => emitted = true);
    component.onSubmit({ stopPropagation: () => {}});
    tick(2000);
    fixture.detectChanges();
    expect(emitted).toBeTruthy();
  }));
});
