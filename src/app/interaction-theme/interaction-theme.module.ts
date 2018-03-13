import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TopBarModule} from '../modules/top-bar/top-bar.module';
import {ChatModule} from '../modules/chat/chat.module';
import {ChatPanelsModule} from '../modules/chat-panels/chat-panels.module';
import {MessagesModule} from '../modules/messages/messages.module';
import {ClosePanelModule} from '../modules/close-panel/close-panel.module';
import {LoadingPanelModule} from '../modules/loading-panel/loading-panel.module';


const layoutModules = [
  TopBarModule,
  ChatModule,
  ChatPanelsModule,
  MessagesModule,
  ClosePanelModule,
  LoadingPanelModule
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
