import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseModalComponent } from './close-modal/close-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    CloseModalComponent
  ],
  declarations: [
    CloseModalComponent
  ]
})
export class CloseModalModule { }
