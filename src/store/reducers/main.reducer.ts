import {ActionReducerMap, createFeatureSelector, MemoizedSelector} from '@ngrx/store';


import {
  WidgetState, MessagesState, DataCollectionState, SurveyState,
  ContextState
} from '../models.interface';
import {reducer as widgetReducer} from './widget.reducer';
import {reducer as messageReducer} from './messages.reducer';
import {reducer as dcReducer} from './dataCollection.reducer';
import {reducer as surveyReducer} from './survey.reducer';
import {reducer as contextReducer} from './context.reducer';

export interface AppState {
  context: ContextState;
  widget: WidgetState;
  messages: MessagesState;
  dataCollection: DataCollectionState;
  survey: SurveyState;
}

export const reducers: ActionReducerMap<AppState> = {
  widget: widgetReducer,
  messages: messageReducer,
  dataCollection: dcReducer,
  survey: surveyReducer,
  context: contextReducer
};

export const getWidgetState = createFeatureSelector<WidgetState>('widget');
export const getMessagesState = createFeatureSelector<MessagesState>('messages');
export const getDataCollectionState = createFeatureSelector<DataCollectionState>('dataCollection');
export const getSurveyState = createFeatureSelector<SurveyState>('survey');
export const getContextState = createFeatureSelector<ContextState>('context');