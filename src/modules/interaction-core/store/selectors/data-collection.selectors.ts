import { createSelector, MemoizedSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromDataCollection from '../reducers/dataCollection.reducer';
import {DataCollectionState} from '../models.interface';

export const getDataCollectionCompleted:MemoizedSelector<Object,DataCollectionState> = createSelector(
  fromFeature.getDataCollectionState,
  fromDataCollection.getDataCollectionCompleted
);
