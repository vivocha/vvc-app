import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages/messages.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
      MessagesComponent
  ],
  declarations: [MessagesComponent, ChatMessageComponent]
})
export class MessagesModule { }
