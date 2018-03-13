import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Angular2AutoScroll} from './autoscroll.directive';
import {DraggableDirective} from './draggable.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    Angular2AutoScroll,
    DraggableDirective
  ],
  declarations: [
    Angular2AutoScroll,
    DraggableDirective
  ]
})
export class LayoutDirectivesModule { }
