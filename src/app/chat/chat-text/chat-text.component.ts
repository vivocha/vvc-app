import {Component, Input, OnInit} from '@angular/core';
import {ChatMsg} from '../../core/core.interfaces';

@Component({
  selector: 'vvc-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.scss']
})
export class ChatTextComponent implements OnInit {

  @Input() msg;
  private messageAudioNotif;
  ngOnInit() {
    if (this.msg.isAgent) {
      this.messageAudioNotif = new Audio();
      this.messageAudioNotif.src = 'assets/beep.mp3';
      this.messageAudioNotif.load();
      this.messageAudioNotif.play();
    }
  }

}
