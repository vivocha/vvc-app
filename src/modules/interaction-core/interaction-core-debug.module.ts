import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { reducers } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment}  from '../../environments/environment';

//import * as fromServices from './services';
import {VvcDataCollectionService} from './services/data-collection.service';
import {VvcContactWrap} from './services/contact-wrap.service';
import {VvcUiService} from './services/ui.service';
import {WindowRef} from './services/window.service';
import {VvcInteractionService} from './services/interaction.service';
import {VvcContextService} from './services/context.service';
import {VvcProtocolService} from './services/protocol.service';
import {VvcMessageService} from './services/messages.service';

export function createTranslateLoader(http: HttpClient) {
  const reg = /(\/a\/\w+\/api\/v2\/public\/campaigns\/\w+\/\w+\/interaction\/)\w+(\/[^\/]+\/[^\/]+)\/main\.html/;
  const res = location.pathname.match(reg);
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
    }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
  ],
  providers: [
    //...fromServices.services
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
export class InteractionCoreDebugModule { }
