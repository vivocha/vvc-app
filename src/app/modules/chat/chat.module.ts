import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';

@NgModule({
  imports: [
    CommonModule,
    NgxAutoScrollModule
  ],
  exports: [ChatComponent,ChatAreaComponent],
  declarations: [ChatComponent, ChatAreaComponent]
})
export class ChatModule { }
