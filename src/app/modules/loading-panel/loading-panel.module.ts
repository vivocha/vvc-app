import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPanelComponent } from './loading-panel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LoadingPanelComponent
  ],
  declarations: [LoadingPanelComponent]
})
export class LoadingPanelModule { }
