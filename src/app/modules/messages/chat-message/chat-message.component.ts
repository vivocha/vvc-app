import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-chat-message',
  templateUrl: './chat-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {

  @Input() message;
  @Output() showDoc = new EventEmitter();

  openDocument(url){
    this.showDoc.emit(url);
  }

}
