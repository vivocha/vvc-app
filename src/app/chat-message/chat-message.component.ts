import {
  Component, OnInit, Input, EventEmitter, Output
} from '@angular/core';

@Component({
  selector: 'vvc-chat-message',
  templateUrl: './chat-message.component.html'
})
export class ChatMessageComponent implements OnInit {
  @Input() message;
  @Output() download = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  isImage() {
    return (((this.message.meta && this.message.meta.mimetype) || '').toLowerCase().split('/') || [])[0] === 'image';
  }
}
