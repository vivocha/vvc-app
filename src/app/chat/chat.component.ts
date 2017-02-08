import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ChatMsg} from '../core/core.interfaces';

@Component({
  selector: 'vvc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() messages: Array<ChatMsg>= [];
  @Output() action = new EventEmitter();
  @Output() acceptOffer = new EventEmitter();
  @Output() rejectOffer = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  sendMessage(textArea: HTMLTextAreaElement) {
    textArea.value = textArea.value.replace(/\n$/, '');
    if (textArea.value === '') {
      return;
    }
    this.action.emit({ text: textArea.value });
    textArea.value = '';
  }

}
