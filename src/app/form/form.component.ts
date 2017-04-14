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
    for (const idx in this.dc.data) {
      const el = this.dc.data[idx];
      const validators = [];
      // validators.push(el.value || '');
      if (el.required) {
        validators.push(Validators.required);
        this.hasRequired = true;
      }
      if (el.type === 'email') {
        validators.push(Validators.email);
      }
      controllers[el.id] = [(this.dc.dataValue && this.dc.dataValue[el.id]) || el.value || '', validators];
    }
    this.form = this.fb.group(controllers);
  }

  getForm() {
    return this.form;
  }

  onSubmit( event ) {
    event.stopPropagation();
    this.submit.emit(this.form.value);
  }

}
