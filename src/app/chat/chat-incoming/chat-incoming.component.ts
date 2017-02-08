import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'vvc-chat-incoming',
  templateUrl: './chat-incoming.component.html',
  styleUrls: ['./chat-incoming.component.scss']
})
export class ChatIncomingComponent implements OnInit {

  @Input() msg;
  @Output() rejectOffer = new EventEmitter();
  @Output() acceptOffer = new EventEmitter();
  constructor() { }

  accept() {
    this.acceptOffer.emit(this.msg);
  }
  reject() {
    this.rejectOffer.emit(this.msg);
  }
  ngOnInit() {
    console.log('MSG', this.msg);
  }

}

