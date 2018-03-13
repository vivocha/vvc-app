import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'vvc-inc-dc',
  templateUrl: './inc-dc.component.html'
})
export class IncDcComponent implements OnInit {

  @Input() message;
  @Input() dc;
  @Output() show = new EventEmitter();
  @Output() submit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onInlineSubmit(formValue) {
    this.dc.dataValue = formValue;
    this.submit.emit({ msg: this.message, dataCollection: this.dc });
  }

}
