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
  private messageAudioNotif;
  constructor() { }

  accept(receiveOnly) {
    this.msg.receiveOnly = receiveOnly;
    this.acceptOffer.emit(this.msg);
  }
  reject() {
    this.rejectOffer.emit(this.msg);
  }
  ngOnInit() {
    if (this.msg.state === 'request') {
      this.messageAudioNotif = new Audio();
      this.messageAudioNotif.src = 'assets/chime.mp3';
      this.messageAudioNotif.load();
      this.messageAudioNotif.play();
    }
  }
}

