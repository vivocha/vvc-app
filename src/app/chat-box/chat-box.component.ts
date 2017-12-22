import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-chat-box',
  templateUrl: './chat-box.component.html'
})
export class ChatBoxComponent implements OnInit {

  emojiPanel = false;
  uploadPanel = false;
  textAreaRows = 1;

  @Input() variables;
  @Output() message = new EventEmitter();
  @Output() upload = new EventEmitter();
  @Output() emoji = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  closeAllPanels() {
    this.emojiPanel = false;
    this.uploadPanel = false;
  }
  sendMessage(textArea: HTMLTextAreaElement) {
    textArea.value = textArea.value.replace(/\n$/, '');
    if (textArea.value !== '') {
      this.message.emit(textArea.value);
      textArea.value = '';
      this.textAreaRows = 1;
    }
  }
  toggleEmojiTool() {
    this.uploadPanel = false;
    return this.emojiPanel = !this.emojiPanel;
  }
  toggleUploadTool() {
    this.emojiPanel = false;
    return this.uploadPanel = !this.uploadPanel;
  }
  calcRows(chatInput) {
    /** TODO: find a better solution **/
    const h = chatInput.scrollHeight;
    if (h < 18) {
      this.textAreaRows = 1;
    }
    if (h > 37) {
      this.textAreaRows = 2;
    }
    if (h > 57) {
      this.textAreaRows = 3;
    }
  }

  insertEmoji(chatInput, insertEmoji) {
    const firstHalf = chatInput.value.substring(0, chatInput.selectionStart);
    const lastHalf = chatInput.value.substring(chatInput.selectionEnd);
    chatInput.value = firstHalf + (firstHalf ? ' ' : '') + insertEmoji + '  ' + lastHalf;
  }
}
