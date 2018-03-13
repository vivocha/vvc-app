import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoThumbsComponent} from './video-thumbs/video-thumbs.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    VideoThumbsComponent
  ],
  declarations: [
    VideoThumbsComponent
  ]
})
export class VideoThumbsModule { }
