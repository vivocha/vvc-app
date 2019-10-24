import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'vvc-chat-message',
  templateUrl: './chat-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {

  @Input() message;
  @Output() showDoc = new EventEmitter();

  @HostListener('click', ['$event'])
  onClick(event) {
    event.preventDefault();
    if (event.target.href){
      this.openDocument(event.target.href);
    }
  }

  constructor(private sanitizer: DomSanitizer){}

  openDocument(url){
    this.showDoc.emit(url);
  }

  sanitizeThis(url){
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

}
