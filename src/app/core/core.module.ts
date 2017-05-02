import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WindowRef} from './window.service';
import {VvcContactService} from './contact.service';
import {ActionReducer, combineReducers, StoreModule} from '@ngrx/store';
import {widgetState, messages} from './core.reducers';
import {VvcDataCollectionService} from './dc.service';
import {VvcWidgetState} from './core.interfaces';


const reducers = {widgetState, messages};

const productionReducer: ActionReducer<VvcWidgetState> = combineReducers(reducers);

export function reducer(state: any, action: any) {

    return productionReducer(state, action);

}

@NgModule({
  imports: [
    CommonModule,
    // StoreModule.provideStore({widgetState, messages})
    StoreModule.provideStore(reducer)
  ],
  declarations: [],
  providers: [
    WindowRef,
    { provide: VvcContactService, useClass: VvcContactService },
    { provide: VvcDataCollectionService, useClass: VvcDataCollectionService}
  ]
})
export class CoreModule { }
