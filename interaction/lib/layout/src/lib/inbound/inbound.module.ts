import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {VvcCommonModule} from '../common/vvc-common.module';
import {InboundComponent} from './inbound/inbound.component';
import {InboundTopbarComponent} from './inbound-topbar/inbound-topbar.component';
import {InboundFullscreenMessagesComponent} from './inbound-fullscreen-messages/inbound-fullscreen-messages.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    VvcCommonModule
  ],
  exports: [InboundComponent],
  declarations: [
    InboundComponent,
    InboundTopbarComponent,
    InboundFullscreenMessagesComponent
  ]
})
export class InboundModule { }
