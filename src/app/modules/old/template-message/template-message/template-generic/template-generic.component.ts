import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vvc-template-generic',
  templateUrl: './template-generic.component.html',
  styles: []
})
export class TemplateGenericComponent implements OnInit {

  @Input() message;
  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  buttonClicked(button){
    this.action.emit(button);
  }

}
