import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'vvc-chat-message',
  templateUrl: './chat-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {

  @Input() message;
  @Output() showDoc = new EventEmitter();

  constructor(private sanitizer: DomSanitizer){}

  openDocument(url){
    this.showDoc.emit(url);
  }

  sanitizeThis(url){
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

}
