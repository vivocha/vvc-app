import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TopbarComponent } from './topbar/topbar.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    TopbarComponent
  ],
  declarations: [
    TopbarComponent
  ]
})
export class TopbarModule { }
