import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { IncomingMessageComponent } from './incoming-message/incoming-message.component';
import { MediaToolsComponent } from './media-tools/media-tools.component';
import { Angular2AutoScroll } from './autoscroll.directive';
import { CloseModalComponent } from './close-modal/close-modal.component';
import { QueueComponent } from './queue/queue.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { SurveyComponent } from './survey/survey.component';
import { InitialDataComponent } from './initial-data/initial-data.component';
import { IncDcComponent } from './inc-dc/inc-dc.component';
import { FormComponent } from './form/form.component';
import { DcViewerComponent } from './dc-viewer/dc-viewer.component';
import { MinimizedComponent } from './minimized/minimized.component';
import { NoChatComponent } from './no-chat/no-chat.component';
import { VideoThumbsComponent } from './video-thumbs/video-thumbs.component';
import { DraggableDirective } from './draggable.directive';
import { TemplateMessageComponent } from './template-message/template-message.component';
import { TemplateGenericComponent } from './template-message/template-generic/template-generic.component';
import { QuickMessageComponent } from './quick-message/quick-message.component';
import {InteractionThemeModule} from './interaction-theme/interaction-theme.module';


export function createTranslateLoader(http: HttpClient) {
  const reg = /(\/a\/\w+\/api\/v2\/public\/campaigns\/\w+\/\w+\/interaction\/)\w+(\/[^\/]+\/[^\/]+)\/main\.html/;
  const res = location.pathname.match(reg);
  const url = location.origin + res[1];
  return new TranslateHttpLoader(http, url, res[2] + '/strings.json');
}

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    TopbarComponent,
    ChatMessageComponent,
    IncomingMessageComponent,
    MediaToolsComponent,
    Angular2AutoScroll,
    CloseModalComponent,
    FullscreenComponent,
    SurveyComponent,
    InitialDataComponent,
    IncDcComponent,
    FormComponent,
    DcViewerComponent,
    MinimizedComponent,
    NoChatComponent,
    VideoThumbsComponent,
    DraggableDirective,
    TemplateMessageComponent,
    TemplateGenericComponent,
    QuickMessageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    FormsModule,
    HttpClientModule,
    CoreModule,
    InteractionThemeModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
