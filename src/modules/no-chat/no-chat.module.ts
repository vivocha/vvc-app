import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NoChatComponent } from './no-chat/no-chat.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    NoChatComponent
  ],
  declarations: [
    NoChatComponent
  ]
})
export class NoChatModule { }
