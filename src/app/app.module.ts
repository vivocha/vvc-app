import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Angular2AutoScroll } from './autoscroll.directive';
import { DraggableDirective } from './draggable.directive';
import { InteractionThemeModule } from './interaction-theme/interaction-theme.module';
import { InteractionCoreModule } from './interaction-core/interaction-core.module';


@NgModule({
  declarations: [
    AppComponent,
    Angular2AutoScroll,
    DraggableDirective
  ],
  imports: [
    BrowserModule,
    InteractionCoreModule,
    InteractionThemeModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
