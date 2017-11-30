import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import { DataCollectionField } from '@vivocha/global-entities/dist/data_collection';

@Component({
  selector: 'vvc-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  forms: {
    [id: string]: FormGroup;
  };
  form: FormGroup;
  hasRequired = false;
  @Input() dc;
  @Input() readMode = false;
  @Output() submit = new EventEmitter();
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const controllers = {};
    for (const idx in this.dc.fields) {
      const el = this.dc.fields[idx];
      const validators = [];

      el.value = el.defaultConstant;
      // validators.push(el.value || '');
      if (el.required) {
        validators.push(Validators.required);
        this.hasRequired = true;
      }
      if (el.minLength) {
        if (el.type === 'string') {
          validators.push(Validators.minLength(el.minLength));
        } else if (el.type === 'number') {
          validators.push(Validators.min(el.minLength));
        }
      }
      if (el.maxLength) {
        if (el.type === 'string') {
          validators.push(Validators.maxLength(el.maxLength));
        } else if (el.type === 'number') {
          validators.push(Validators.max(el.maxLength));
        }
      }
      if (el.validation) {
        validators.push(Validators.pattern(el.validation));
      }
      if (el.format === 'email') {
        validators.push(Validators.email);
      }
      controllers[el.id] = [(this.dc.dataValue && this.dc.dataValue[el.id]) || el.value || '', validators];
    }
    this.form = this.fb.group(controllers);
  }

  getForm() {
    return this.form;
  }

  getInputElement(elem: DataCollectionField): string {
    let element;
    switch(elem.format) {
      case 'dropdown':
        element = 'select'
        break;
      case 'checkbox':
      case 'radio':
      case 'rating':
      case 'textarea':
        element = elem.format;
        break;
      default:
        element = 'input';
        break;
    }
    return element;
  }

  getInputType(elem: DataCollectionField) {
    if (['text','email','date','time'].indexOf(elem.format) !== -1) {
      return elem.format;
    } else if (elem.format === 'phonenum'){
      return 'tel';
    } else if (elem.format === 'link'){
      return 'url';
    } else if (elem.format === 'date-time'){
      return 'datetime-local';
    } else {
      return elem.type;
    }
  }

  onSubmit( event ) {
    event.stopPropagation();
    this.submit.emit(this.form.value);
  }

  optionsKeys(elem) {
    return Object.keys(elem);
  }
}
