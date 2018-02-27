import {ActionReducerMap, createFeatureSelector, MemoizedSelector} from '@ngrx/store';

import * as fromContext from './context.reducer';
import * as fromMessages from './messages.reducer';
import * as fromWidget from './widget.reducer';

import {ContextState, MessagesState, WidgetState} from '../models.interface';

export interface AppState {
  context: ContextState;
  messages: MessagesState;
  widgetState: WidgetState
}

export const reducers: ActionReducerMap<AppState> = {
  context: fromContext.reducer,
  messages: fromMessages.reducer,
  widgetState: fromWidget.reducer
};

export const getContextState: MemoizedSelector<ContextState, any> = createFeatureSelector<ContextState>('context');
export const getMessagesState: MemoizedSelector<MessagesState, any> = createFeatureSelector<MessagesState>('messages');
export const getWidgetState: MemoizedSelector<WidgetState, any> = createFeatureSelector<WidgetState>('widgetState');