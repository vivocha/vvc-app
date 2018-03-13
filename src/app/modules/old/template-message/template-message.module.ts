import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TemplateMessageComponent} from './template-message/template-message.component';
import {TemplateGenericComponent} from './template-message/template-generic/template-generic.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    TemplateMessageComponent
  ],
  declarations: [
    TemplateMessageComponent,
    TemplateGenericComponent
  ]
})
export class TemplateMessageModule { }
