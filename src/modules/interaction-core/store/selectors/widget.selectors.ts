import { createSelector, MemoizedSelector } from '@ngrx/store';
import {UiState} from '../models.interface';
import {getWidgetState, getMessagesState, getDataCollectionState, getSurveyState} from '../reducers/main.reducer';
import {getUiStateRedux} from '../reducers/widget.reducer';
export const getUiState:MemoizedSelector<Object,UiState> = createSelector(
  getWidgetState,
  getMessagesState,
  getDataCollectionState,
  getSurveyState,
  getUiStateRedux
);