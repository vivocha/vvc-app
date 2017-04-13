import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'vvc-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  form: FormGroup;

  @Input() dc;
  @Output() submit = new EventEmitter();
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const controllers = {};
    for (const idx in this.dc.data) {
      const el = this.dc.data[idx];
      const validators = [];
      validators.push(el.value || '');
      if (el.required) {
        validators.push(Validators.required);
      }
      controllers[el.id] = validators;
    }
    this.form = this.fb.group(controllers);
  }

  onSubmit( event ) {
    event.stopPropagation();
    this.submit.emit(this.form.value);
  }

}
