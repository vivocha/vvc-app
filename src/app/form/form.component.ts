import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import { DataCollection, DataCollectionField } from '@vivocha/global-entities/dist/data_collection';

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
    let visibleElements = false;
    for (const idx in this.dc.fields) {
      const elem = this.dc.fields[idx];
      const validators = [];
      const hasDefault = typeof elem.defaultConstant !== 'undefined';

      elem.value = elem.defaultConstant;
      if ((['visitor','both'].indexOf(elem.hidden) === -1 && (!hasDefault || (hasDefault && elem.editIfDefault)))) {
        elem.showElement = true;
        visibleElements = true;
      }

      // validators.push(el.value || '');
      if (elem.required) {
        validators.push(Validators.required);
        this.hasRequired = true;
      }
      if (elem.minLength) {
        if (elem.type === 'string') {
          validators.push(Validators.minLength(elem.minLength));
        } else if (elem.type === 'number') {
          validators.push(Validators.min(elem.minLength));
        }
      }
      if (elem.maxLength) {
        if (elem.type === 'string') {
          validators.push(Validators.maxLength(elem.maxLength));
        } else if (elem.type === 'number') {
          validators.push(Validators.max(elem.maxLength));
        }
      }
      if (elem.validation) {
        validators.push(Validators.pattern(elem.validation));
      }
      if (elem.format === 'email') {
        validators.push(Validators.email);
      }
      controllers[elem.id] = [(this.dc.dataValue && this.dc.dataValue[elem.id]) || elem.value || '', validators];
    }
    this.form = this.fb.group(controllers);

    if (!visibleElements) {
      this.onSubmit(new Event('submit'));
    }
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
