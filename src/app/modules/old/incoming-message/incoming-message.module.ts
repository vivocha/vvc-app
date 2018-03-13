import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { IncomingMessageComponent } from './incoming-message/incoming-message.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    IncomingMessageComponent
  ],
  declarations: [
    IncomingMessageComponent
  ]
})
export class IncomingMessageModule { }
