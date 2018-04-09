import { createSelector, MemoizedSelector } from '@ngrx/store';
import {DataCollectionState} from '../models.interface';
import {getDataCollectionState} from '../reducers/main.reducer';
import {getDataCollectionCompletedRedux} from '../reducers/dataCollection.reducer';
export const getDataCollectionCompleted:MemoizedSelector<Object,DataCollectionState> = createSelector(
  getDataCollectionState,
  getDataCollectionCompletedRedux
);
