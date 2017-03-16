import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media/media.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [MediaComponent],
  declarations: [MediaComponent]
})
export class MediaModule { }
