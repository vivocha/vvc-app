import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClosePanelComponent } from './close-panel.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    ClosePanelComponent
  ],
  declarations: [ClosePanelComponent]
})
export class ClosePanelModule { }
