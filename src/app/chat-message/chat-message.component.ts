import {Component, OnInit, Input, trigger, state, style, transition, animate} from '@angular/core';

@Component({
  selector: 'vvc-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
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
export class ChatMessageComponent implements OnInit {
  private state = 'inactive';
  @Input() message;
  constructor() { }

  ngOnInit() {
    if (this.message.isAgent && this.message.state != 'iswriting') {
      const notif = new Audio();
      notif.src = 'assets/beep.mp3';
      notif.load();
      notif.play();
    }
    setTimeout( () => {
      this.state = 'active';
    }, 100);
  }

}
