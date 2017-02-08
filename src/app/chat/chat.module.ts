import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatComponent} from './chat.component';
import { ChatTextComponent } from './chat-text/chat-text.component';
import {VvcAutoScroll} from './autoscroll.directive';
import { ChatIncomingComponent } from './chat-incoming/chat-incoming.component';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
      ChatComponent
  ],
  declarations: [ChatComponent, ChatTextComponent, VvcAutoScroll, ChatIncomingComponent]
})
export class ChatModule { }
