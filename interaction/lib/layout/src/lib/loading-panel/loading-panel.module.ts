import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPanelComponent } from './loading-panel.component';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    LoadingPanelComponent
  ],
  declarations: [LoadingPanelComponent]
})
export class LoadingPanelModule { }
