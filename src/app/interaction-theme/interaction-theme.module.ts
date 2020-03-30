import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  QueueModule,
  CbnModule,
  InboundModule
} from '@vivocha/client-interaction-layout';

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
  MinimizedModule,
  CbnModule,
  InboundModule
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
