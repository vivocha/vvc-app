import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  emojiPanel = false;
  uploadPanel = false;
  textAreaRows = 1;

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
    return this.emojiPanel = !this.emojiPanel;
  }
  toggleUploadTool() {
    return this.uploadPanel = !this.uploadPanel;
  }
  calcRows(chatInput) {
    const h = chatInput.scrollHeight;
    if (h < 35) {
      this.textAreaRows = 1;
    }
    if (h > 47) {
      this.textAreaRows = 2;
    }
    if (h > 69) {
      this.textAreaRows = 3;
    }
  }

}
