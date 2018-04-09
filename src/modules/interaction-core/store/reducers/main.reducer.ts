import {ActionReducerMap, createFeatureSelector, MemoizedSelector} from '@ngrx/store';


import {ContextState, MessagesState, WidgetState, DataCollectionState, SurveyState} from '../models.interface';
import {reducer as contextReducer} from './context.reducer';
import {reducer as messageReducer} from './messages.reducer';
import {reducer as widgetReducer} from './widget.reducer';
import {reducer as dcReducer} from './dataCollection.reducer';
import {reducer as surveyReducer} from './survey.reducer';

export interface AppState {
  context: ContextState;
  messages: MessagesState;
  widget: WidgetState;
  dataCollection: DataCollectionState;
  survey: SurveyState;
}

export const reducers: ActionReducerMap<AppState> = {
  context: contextReducer,
  messages: messageReducer,
  widget: widgetReducer,
  dataCollection: dcReducer,
  survey: surveyReducer
};

export const getContextState = createFeatureSelector<ContextState>('context');
export const getMessagesState = createFeatureSelector<MessagesState>('messages');
export const getWidgetState = createFeatureSelector<WidgetState>('widget');
export const getDataCollectionState = createFeatureSelector<DataCollectionState>('dataCollection');
export const getSurveyState = createFeatureSelector<SurveyState>('survey');