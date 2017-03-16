import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages/messages.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { IncomingMessageComponent } from './incoming-message/incoming-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
      MessagesComponent
  ],
  declarations: [MessagesComponent, ChatMessageComponent, IncomingMessageComponent]
})
export class MessagesModule { }
