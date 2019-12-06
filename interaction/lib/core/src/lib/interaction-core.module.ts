import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {VvcDataCollectionService} from './services/data-collection.service';
import {VvcContactWrap} from './services/contact-wrap.service';
import {VvcUiService} from './services/ui.service';
import {WindowRef} from './services/window.service';
import {VvcInteractionService} from './services/interaction.service';
import {VvcContextService} from './services/context.service';
import {VvcProtocolService} from './services/protocol.service';
import {VvcMessageService} from './services/messages.service';

import { reducers } from './store/reducers/main.reducer'

export function createTranslateLoader(http: HttpClient) {
  const reg = /(.*\/api\/v[0-9]+\/public\/campaigns\/\w+\/\w+\/interaction\/)\w+(\/[^\/]+\/[^\/]+)\/main\.html/;
  const res = location.pathname.match(reg);
  console.log(location.pathname, res, res[1]);
  const url = location.origin + res[1];
  return new TranslateHttpLoader(http, url, res[2] + '/strings.json');
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    VvcInteractionService,
    VvcMessageService,
    VvcContextService,
    VvcContactWrap,
    VvcUiService,
    VvcProtocolService,
    VvcDataCollectionService,
    WindowRef
  ]
})
export class InteractionCoreModule { }
