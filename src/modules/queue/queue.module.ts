import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { QueueComponent } from './queue/queue.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    QueueComponent
  ],
  declarations: [
    QueueComponent
  ]
})
export class QueueModule { }
