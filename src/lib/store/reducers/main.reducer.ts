import {ActionReducerMap, createFeatureSelector, MemoizedSelector} from '@ngrx/store';
import {
  WidgetState, MessagesState, DataCollectionState, ContextState
} from '../models.interface';
import {reducer as widgetReducer} from './widget.reducer';
import {reducer as messageReducer} from './messages.reducer';
import {reducer as dcReducer} from './dataCollection.reducer';
import {reducer as contextReducer} from './context.reducer';

export interface AppState {
  context: ContextState;
  widget: WidgetState;
  messages: MessagesState;
  dataCollection: DataCollectionState;
}

export const reducers: ActionReducerMap<AppState> = {
  context: contextReducer,
  widget: widgetReducer,
  messages: messageReducer,
  dataCollection: dcReducer,
};

export const getWidgetState = createFeatureSelector<WidgetState>('widget');
export const getMessagesState = createFeatureSelector<MessagesState>('messages');
export const getDataCollectionState = createFeatureSelector<DataCollectionState>('dataCollection');
export const getContextState = createFeatureSelector<ContextState>('context');
