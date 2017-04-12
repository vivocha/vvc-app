import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  @Input() dc;
  @Output() submit = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
