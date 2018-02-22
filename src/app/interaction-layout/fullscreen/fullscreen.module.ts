import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FullscreenComponent } from './fullscreen/fullscreen.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    FullscreenComponent
  ],
  declarations: [
    FullscreenComponent
  ]
})
export class FullscreenModule { }
