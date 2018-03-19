import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';

import * as fromContext from './context.reducer';
import * as fromMessages from './messages.reducer';
import * as fromWidget from './widget.reducer';

import {ContextState, MessagesState, WidgetState} from '../models.interface';

export interface AppState {
  context: ContextState;
  messages: MessagesState;
  widget: WidgetState
}

export const reducers: ActionReducerMap<AppState> = {
  context: fromContext.reducer,
  messages: fromMessages.reducer,
  widget: fromWidget.reducer
};

export const getContextState = createFeatureSelector<ContextState>('context');
export const getMessagesState = createFeatureSelector<MessagesState>('messages');
export const getWidgetState = createFeatureSelector<WidgetState>('widget');