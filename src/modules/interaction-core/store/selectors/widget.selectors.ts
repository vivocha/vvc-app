import { createSelector, MemoizedSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromWidget from '../reducers/widget.reducer';
import {UiState} from '../models.interface';
/*
export const getUiTopBarState = createSelector(
  fromFeature.getWidgetState,
  fromWidget.getUiTopBarState
);
export const getUiChatState = createSelector(
  fromFeature.getContextState,
  fromFeature.getWidgetState,
  fromWidget.getUiChatState
);
*/
export const getUiState:MemoizedSelector<Object,UiState> = createSelector(
  fromFeature.getWidgetState,
  fromFeature.getMessagesState,
  fromFeature.getDataCollectionState,
  fromFeature.getSurveyState,
  fromWidget.getUiState
);