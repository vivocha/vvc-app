import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InteractionThemeModule } from './interaction-theme/interaction-theme.module';
//import { InteractionCoreModule } from '@vivocha/client-interaction-core';
import { InteractionCoreDebugModule } from './interaction-core/interaction-core-debug.module'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InteractionCoreDebugModule,
    InteractionThemeModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
