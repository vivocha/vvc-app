import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatBoxModule} from '../interaction-layout/chat-box/chat-box.module';

const layoutModules = [
  ChatBoxModule
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
