import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

import { AppComponent } from './app.component';
import {TopBarModule} from './top-bar/top-bar.module';
import { LoadingComponent } from './loading/loading.component';
import {CoreModule} from './core/core.module';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/WidgetTranslations/xl8', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
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
    TopBarModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
