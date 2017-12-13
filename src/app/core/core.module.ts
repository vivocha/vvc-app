import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WindowRef} from './window.service';
import {VvcContactService} from './contact.service';
import {ActionReducer, combineReducers, StoreModule} from '@ngrx/store';
import {widgetState, messages} from './core.reducers';
import {VvcWidgetState} from './core.interfaces';

const reducers = {widgetState, messages};

const productionReducer: ActionReducer<{widgetState: VvcWidgetState, messages: any[]}> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}

@NgModule({
  imports: [
    CommonModule,
    // StoreModule.provideStore({widgetState, messages})
    StoreModule.forRoot(reducers, {})
  ],
  declarations: [],
  providers: [
    WindowRef,
    { provide: VvcContactService, useClass: VvcContactService }
  ]
})
export class CoreModule { }
