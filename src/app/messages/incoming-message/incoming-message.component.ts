import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-incoming-message',
  templateUrl: './incoming-message.component.html',
  styleUrls: ['./incoming-message.component.scss']
})
export class IncomingMessageComponent implements OnInit {

  @Input() message;
  @Output() rejectOffer = new EventEmitter();
  @Output() acceptOffer = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
