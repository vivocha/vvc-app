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
  fromFeature.getWidgetState,
  fromUi.getUiClosePanelState
);
export const getUiTopBarState = createSelector(
  fromFeature.getWidgetState,
  fromUi.getUiTopBarState
);
export const getUiChatState = createSelector(
  fromFeature.getWidgetState,
  fromUi.getUiChatState
);

export const getUiState = createSelector(
  getUiLoadingPanelState,
  getUiClosePanelState,
  getUiTopBarState,
  getUiChatState,
  fromUi.getUiState
);