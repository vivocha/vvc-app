import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromDataCollection from '../reducers/dataCollection.reducer';

export const getDataCollectionCompleted = createSelector(
  fromFeature.getDataCollectionState,
  fromDataCollection.getDataCollectionCompleted
);