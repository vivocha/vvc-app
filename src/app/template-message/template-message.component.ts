import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vvc-template-message',
  templateUrl: './template-message.component.html',
  styles: []
})
export class TemplateMessageComponent implements OnInit {

  @Input() message;
  @Output() action = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
