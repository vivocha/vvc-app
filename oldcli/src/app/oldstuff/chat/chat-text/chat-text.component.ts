import {Component, Input, OnInit, trigger, transition, animate, state, style} from '@angular/core';
import {ChatMsg} from '../../core/core.interfaces';

@Component({
  selector: 'vvc-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.scss'],
  animations: [
    trigger('ease', [
      state('inactive', style({
        transform: 'scale(0)'
      })),
      state('active',   style({
        transform: 'scale(1)'
      })),
      transition('inactive => active', animate('100ms ease-in'))
    ])
  ]
})
export class ChatTextComponent implements OnInit {

  @Input() msg;
  private messageAudioNotif;
  private state = 'inactive';
  ngOnInit() {
    if (this.msg.isAgent) {
      this.messageAudioNotif = new Audio();
      this.messageAudioNotif.src = 'assets/beep.mp3';
      this.messageAudioNotif.load();
      this.messageAudioNotif.play();
    }
    setTimeout( () => {
      this.state = 'active';
    }, 100);
  }

}
