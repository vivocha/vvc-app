import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    ChatMessageComponent
  ],
  declarations: [
    ChatMessageComponent
  ]
})
export class ChatMessageModule { }
