import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromUi from '../reducers/ui.reducer';

/*
export const getPushedDataCollections = createSelector(
  fromFeature.getUiState,
  fromUi.getPushedDataCollections
);
*/
export const getUiLoadingPanelState = createSelector(
  fromFeature.getContextState,
  fromUi.getUiLoadingPanelState
);
export const getUiClosePanelState = createSelector(
  fromFeature.getEventState,
  fromFeature.getWidgetState,
  fromUi.getUiClosePanelState
);
export const getUiTopBarState = createSelector(
  fromFeature.getEventState,
  fromFeature.getWidgetState,
  fromUi.getUiTopBarState
);
export const getUiChatState = createSelector(
  fromFeature.getContextState,
  fromFeature.getWidgetState,
  fromFeature.getEventState,
  fromUi.getUiChatState
);

export const getUiState = createSelector(
  getUiLoadingPanelState,
  getUiClosePanelState,
  getUiTopBarState,
  getUiChatState,
  fromFeature.getMessagesState,
  fromUi.getUiState
);