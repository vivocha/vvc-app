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
  QueueModule
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
