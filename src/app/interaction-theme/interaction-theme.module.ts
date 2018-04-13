import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarModule } from '../modules/top-bar/top-bar.module';
import { ChatModule } from '../modules/chat/chat.module';
import { ChatPanelsModule } from '../modules/chat-panels/chat-panels.module';
import { MessagesModule } from '../modules/messages/messages.module';
import { ClosePanelModule } from '../modules/close-panel/close-panel.module';
import { LoadingPanelModule } from '../modules/loading-panel/loading-panel.module';
import { MinimizedModule } from '../modules/minimized/minimized.module';
import { DataCollectionModule } from '../modules/data-collection/data-collection.module';
import { MultimediaModule } from '../modules/multimedia/multimedia.module';
import { QueueModule } from '../modules/queue/queue.module';
/*
import {
  TopBarModule,
  ChatModule,
  ChatPanelsModule,
  MessagesModule,
  ClosePanelModule,
  LoadingPanelModule,
  MinimizedModule,
  DataCollectionModule,
  MultimediaModule,
  QueueModule
} from '@vivocha/client-interaction-layout';
*/

const layoutModules = [
  TopBarModule,
  DataCollectionModule,
  QueueModule,
  ChatModule,
  ChatPanelsModule,
  MessagesModule,
  MultimediaModule,
  ClosePanelModule,
  LoadingPanelModule,
  MinimizedModule
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
