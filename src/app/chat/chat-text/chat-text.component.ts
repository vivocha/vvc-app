import {Component, Input} from '@angular/core';
import {ChatMsg} from '../../core/core.interfaces';

@Component({
  selector: 'vvc-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.scss']
})
export class ChatTextComponent {

  @Input() msg: ChatMsg;
}
