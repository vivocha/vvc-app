import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media/media.component';
import {TranslateModule} from '@ngx-translate/core';
import { FullScreenVideoComponent } from './full-screen-video/full-screen-video.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [MediaComponent, FullScreenVideoComponent],
  declarations: [MediaComponent, FullScreenVideoComponent]
})
export class MultimediaModule { }
