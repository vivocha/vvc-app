import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowRef } from './window.service';
import { VvcContactService } from './contact.service';
import { ActionReducer, combineReducers, StoreModule } from '@ngrx/store';
import { widgetState, messages } from './core.reducers';
import { VvcWidgetState } from './core.interfaces';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { VvcInteractionService } from './interaction.service';
import { reducers } from './store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';



const reducers1 = {widgetState, messages};
const productionReducer: ActionReducer<{widgetState: VvcWidgetState, messages: any[]}> = combineReducers(reducers1);


export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

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
    })
  ],
  providers: [
    WindowRef,
    { provide: VvcContactService, useClass: VvcContactService },
    VvcInteractionService
  ],
  exports: [
    VvcInteractionService
  ]
})
export class InteractionCoreModule { }
