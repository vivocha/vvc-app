import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

import {CoreModule} from './core/core.module';
import {QueueModule} from './queue/queue.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {IncomingMessageComponent} from './incoming-message/incoming-message.component';
import { VideoWrapperComponent } from './video-wrapper/video-wrapper.component';
import { MediaToolsComponent } from './media-tools/media-tools.component';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/WidgetTranslations/xl8', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    ChatMessageComponent,
    IncomingMessageComponent,
    VideoWrapperComponent,
    MediaToolsComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    FormsModule,
    HttpModule,
    CoreModule,
    QueueModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
