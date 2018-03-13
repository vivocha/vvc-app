import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ChatComponent,ChatAreaComponent],
  declarations: [ChatComponent, ChatAreaComponent]
})
export class ChatModule { }
