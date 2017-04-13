import {
  Component, OnInit, Input, trigger, state, style, transition, animate, EventEmitter, Output
} from '@angular/core';

@Component({
  selector: 'vvc-chat-message',
  templateUrl: './chat-message.component.html',
  animations: [
      /*
    trigger('ease', [
      state('inactive', style({
        transform: 'scale(0)'
      })),
      state('active',   style({
        transform: 'scale(1)'
      })),
      transition('inactive => active', animate('100ms ease-in'))

    ])*/
  ]})
export class ChatMessageComponent implements OnInit {
  state = 'inactive';
  @Input() message;
  @Output() download = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if (this.message.isAgent && this.message.state !== 'iswriting') {
      const notif = new Audio();
      notif.src = 'assets/beep.mp3';
      notif.load();
      notif.play();
    }
    setTimeout( () => {
      this.state = 'active';
    }, 100);
  }
  isImage() {
    return (((this.message.meta && this.message.meta.mimetype) || '').toLowerCase().split('/') || [])[0] === 'image';
  }
}
