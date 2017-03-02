import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueComponent } from './queue/queue.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
      QueueComponent
  ],
  declarations: [QueueComponent]
})
export class QueueModule { }
