import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'vvc-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

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
      // validators.push(el.value || '');
      if (el.required) {
        validators.push(Validators.required);
        this.hasRequired = true;
      }
      if (el.value && el.value.length > 0 && el.format === 'email') {
        validators.push(Validators.email);
      }
      controllers[el.id] = [(this.dc.dataValue && this.dc.dataValue[el.id]) || el.value || '', validators];
    }
    this.form = this.fb.group(controllers);
  }

  getForm() {
    return this.form;
  }

  getInputElement(elem): string {
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

  getInputType(elem) {
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

}
