import {ActionReducerMap, createFeatureSelector, MemoizedSelector} from '@ngrx/store';

import * as fromContext from './context.reducer';
import * as fromMessages from './messages.reducer';
import * as fromWidget from './widget.reducer';
import * as fromDataCollection from './dataCollection.reducer';
import * as fromSurvey from './survey.reducer';

import {ContextState, MessagesState, WidgetState, DataCollectionState, SurveyState} from '../models.interface';

export interface AppState {
  context: ContextState;
  messages: MessagesState;
  widget: WidgetState;
  dataCollection: DataCollectionState;
  survey: SurveyState;
}

export const reducers: ActionReducerMap<AppState> = {
  context: fromContext.reducer,
  messages: fromMessages.reducer,
  widget: fromWidget.reducer,
  dataCollection: fromDataCollection.reducer,
  survey: fromSurvey.reducer
};

export const getContextState = createFeatureSelector<ContextState>('context');
export const getMessagesState = createFeatureSelector<MessagesState>('messages');
export const getWidgetState = createFeatureSelector<WidgetState>('widget');
export const getDataCollectionState = createFeatureSelector<DataCollectionState>('dataCollection');
export const getSurveyState = createFeatureSelector<SurveyState>('survey');