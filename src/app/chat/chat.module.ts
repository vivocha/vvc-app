import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatComponent} from './chat.component';
import { ChatTextComponent } from './chat-text/chat-text.component';
import {VvcAutoScroll} from './autoscroll.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
      ChatComponent
  ],
  declarations: [ChatComponent, ChatTextComponent, VvcAutoScroll]
})
export class ChatModule { }
