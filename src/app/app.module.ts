import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {CoreModule} from './core/core.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {IncomingMessageComponent} from './incoming-message/incoming-message.component';
import { MediaToolsComponent } from './media-tools/media-tools.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { EmojiSelectorComponent } from './emoji-selector/emoji-selector.component';
import {Angular2AutoScroll} from './autoscroll.directive';
import { CloseModalComponent } from './close-modal/close-modal.component';
import {QueueComponent} from './queue/queue.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { SurveyComponent } from './survey/survey.component';


export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, '/WidgetTranslations/xl8/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    TopbarComponent,
    ChatMessageComponent,
    IncomingMessageComponent,
    MediaToolsComponent,
    ChatBoxComponent,
    FileUploaderComponent,
    EmojiSelectorComponent,
    Angular2AutoScroll,
    CloseModalComponent,
    FullscreenComponent,
    SurveyComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    FormsModule,
    HttpModule,
    CoreModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
