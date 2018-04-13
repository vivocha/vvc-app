import { createSelector, MemoizedSelector } from '@ngrx/store';
import {getWidgetState, getMessagesState, getDataCollectionState, getSurveyState} from '../reducers/main.reducer';
import {getUiStateRedux} from '../reducers/widget.reducer';
import {getMessageRedux} from '../reducers/messages.reducer';
import {UiState, MessagesState} from '../models.interface';

export const getMessages:MemoizedSelector<Object,MessagesState> = createSelector(
  getMessagesState,
  getMessageRedux
);

export const getUiState:MemoizedSelector<Object,UiState> = createSelector(
  getWidgetState,
  getMessages,
  getDataCollectionState,
  getSurveyState,
  getUiStateRedux
);
