import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickMessageComponent } from './quick-message/quick-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    QuickMessageComponent
  ],
  declarations: [
    QuickMessageComponent
  ]
})
export class QuickMessageModule { }
