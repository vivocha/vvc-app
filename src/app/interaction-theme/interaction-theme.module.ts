import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxModule } from '../interaction-layout/chat-box/chat-box.module';
import { ChatMessageModule } from '../interaction-layout/chat-message/chat-message.module';
import { CloseModalModule } from '../interaction-layout/close-modal/close-modal.module';
import { DataCollectionModule } from '../interaction-layout/data-collection/data-collection.module';
import { QueueModule } from '../interaction-layout/queue/queue.module';
import { FullscreenModule } from '../interaction-layout/fullscreen/fullscreen.module';
import { IncomingMessageModule } from '../interaction-layout/incoming-message/incoming-message.module';
import { MediaToolsModule } from '../interaction-layout/media-tools/media-tools.module';
import { MinimizedModule } from '../interaction-layout/minimized/minimized.module';
import { NoChatModule } from '../interaction-layout/no-chat/no-chat.module';
import { QuickMessageModule } from '../interaction-layout/quick-message/quick-message.module';
import { TemplateMessageModule } from '../interaction-layout/template-message/template-message.module';
import { TopbarModule } from '../interaction-layout/topbar/topbar.module';
import { VideoThumbsModule } from '../interaction-layout/video-thumbs/video-thumbs.module';

const layoutModules = [
  ChatBoxModule,
  ChatMessageModule,
  CloseModalModule,
  DataCollectionModule,
  FullscreenModule,
  IncomingMessageModule,
  MediaToolsModule,
  MinimizedModule,
  NoChatModule,
  QueueModule,
  QuickMessageModule,
  TemplateMessageModule,
  TopbarModule,
  VideoThumbsModule
];

@NgModule({
  imports: [
    CommonModule,
    ...layoutModules
  ],
  exports: [
    ...layoutModules
  ],
  declarations: [

  ]
})
export class InteractionThemeModule { }
