import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';

import * as fromContext from './context.reducer';
import * as fromMessages from './messages.reducer';
import * as fromWidget from './widget.reducer';
import * as fromDataCollection from './dataCollection.reducer'

import {ContextState, MessagesState, WidgetState, DataCollectionState} from '../models.interface';

export interface AppState {
  context: ContextState;
  messages: MessagesState;
  widget: WidgetState;
  dataCollection: DataCollectionState;
}

export const reducers: ActionReducerMap<AppState> = {
  context: fromContext.reducer,
  messages: fromMessages.reducer,
  widget: fromWidget.reducer,
  dataCollection: fromDataCollection.reducer
};

export const getContextState = createFeatureSelector<ContextState>('context');
export const getMessagesState = createFeatureSelector<MessagesState>('messages');
export const getWidgetState = createFeatureSelector<WidgetState>('widget');
export const getDataCollectionState = createFeatureSelector<DataCollectionState>('dataCollection');