import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';

import * as fromContext from './context.reducer';
import * as fromMessages from './messages.reducer';
import * as fromWidget from './widget.reducer';
import * as fromEvent from './event.reducer';

import {ContextState, EventState, MessagesState, WidgetState} from '../models.interface';

export interface AppState {
  context: ContextState;
  messages: MessagesState;
  widget: WidgetState,
  event: EventState
}

export const reducers: ActionReducerMap<AppState> = {
  context: fromContext.reducer,
  messages: fromMessages.reducer,
  widget: fromWidget.reducer,
  event: fromEvent.reducer
};

export const getContextState = createFeatureSelector<ContextState>('context');
export const getMessagesState = createFeatureSelector<MessagesState>('messages');
export const getWidgetState = createFeatureSelector<WidgetState>('widget');
export const getEventState = createFeatureSelector<EventState>('event');