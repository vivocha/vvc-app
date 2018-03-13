import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { EmojiSelectorComponent } from './emoji-selector/emoji-selector.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    ChatBoxComponent
  ],
  declarations: [
    ChatBoxComponent,
    EmojiSelectorComponent,
    FileUploaderComponent
  ]
})
export class ChatBoxModule { }
