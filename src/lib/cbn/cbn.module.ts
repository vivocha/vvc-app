import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CbnComponent } from './cbn/cbn.component';
import { CbnMinimizedComponent } from './cbn-minimized/cbn-minimized.component';
import { CbnTopbarComponent } from './cbn-topbar/cbn-topbar.component';
import { CbnFullscreenMessagesComponent } from './cbn-fullscreen-messages/cbn-fullscreen-messages.component';
import { CbnMinimizedMessagesComponent } from './cbn-minimized-messages/cbn-minimized-messages.component';
import { VvcCommonModule } from './../common/vvc-common.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    VvcCommonModule
  ],
  exports: [CbnComponent, CbnMinimizedComponent],
  declarations: [
    CbnComponent,
    CbnMinimizedComponent,
    CbnTopbarComponent,
    CbnFullscreenMessagesComponent,
    CbnMinimizedMessagesComponent
  ]
})
export class CbnModule { }
