import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPanelComponent } from './emoji-panel/emoji-panel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[EmojiPanelComponent],
  declarations: [EmojiPanelComponent]
})
export class ChatPanelsModule { }
