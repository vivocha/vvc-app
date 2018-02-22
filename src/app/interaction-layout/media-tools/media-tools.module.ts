import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MediaToolsComponent } from './media-tools/media-tools.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    MediaToolsComponent
  ],
  declarations: [
    MediaToolsComponent
  ]
})
export class MediaToolsModule { }
