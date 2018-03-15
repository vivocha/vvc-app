import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'vvc-chat-area',
  templateUrl: './chat-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAreaComponent {

  @ViewChild('box') box: ElementRef;
  @Input() context;
  @Input() readonly;
  @Output() onSendText = new EventEmitter();
  @Output() toggleEmojiPanel = new EventEmitter();

  appendText(value){
    this.box.nativeElement.value += value;
    this.box.nativeElement.focus();
  }
  sendText(value){
    if (value !== "") {
      this.onSendText.emit(value);
    }
  }
}
