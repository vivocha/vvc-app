import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import {ChatIsWritingComponent} from './chat-is-writing/chat-is-writing.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    NgxAutoScrollModule,
    TranslateModule
  ],
  exports: [ChatComponent,ChatAreaComponent, ChatIsWritingComponent],
  declarations: [ChatComponent, ChatAreaComponent, ChatIsWritingComponent]
})
export class ChatModule { }
