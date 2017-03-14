import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

import {CoreModule} from './core/core.module';
import {QueueModule} from './queue/queue.module';
import {MessagesModule} from './messages/messages.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/WidgetTranslations/xl8', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent
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
    QueueModule,
    MessagesModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
