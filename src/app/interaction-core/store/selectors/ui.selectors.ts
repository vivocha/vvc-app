import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromUi from '../reducers/ui.reducer';

export const getPushedDataCollections = createSelector(
  fromFeature.getUiState,
  fromUi.getPushedDataCollections
);

export const getWidgetStatus = createSelector(
  fromFeature.getUiState,
  fromUi.getWidgetStatus
);