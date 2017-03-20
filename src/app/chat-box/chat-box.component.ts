import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  emojiPanel = false;
  uploadPanel = false;

  uploadFile: File;

  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  onUploading(evt) {
    if (evt.srcElement.files[0]) {
      this.uploadFile = evt.srcElement.files[0];
    }
  }
  removeUpload() {
    this.uploadFile = undefined;
  }
  sendMessage(textArea: HTMLTextAreaElement) {
    textArea.value = textArea.value.replace(/\n$/, '');
    if (textArea.value === '' && this.uploadFile === undefined) return;
    this.action.emit({ text: textArea.value, file: this.uploadFile });
    textArea.value = '';
    this.uploadFile = undefined;
  }
  toggleEmojiTool() {
    return this.emojiPanel = !this.emojiPanel;
  }
  toggleUploadTool() {
    return this.uploadPanel = !this.uploadPanel;
  }

}
