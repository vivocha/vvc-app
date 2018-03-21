import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromWidget from '../reducers/widget.reducer';

export const getUiTopBarState = createSelector(
  fromFeature.getWidgetState,
  fromWidget.getUiTopBarState
);
export const getUiChatState = createSelector(
  fromFeature.getContextState,
  fromFeature.getWidgetState,
  fromWidget.getUiChatState
);
/*
export const getUiState = createSelector(
  fromFeature.getWidgetState,
  getUiTopBarState,
  getUiChatState,
  fromFeature.getMessagesState,
  fromWidget.getUiState
);
*/
export const getUiState = createSelector(
  fromFeature.getWidgetState,
  fromFeature.getMessagesState,
  fromWidget.getUiState
);