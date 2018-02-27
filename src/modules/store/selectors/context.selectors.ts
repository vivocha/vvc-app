import { createSelector, MemoizedSelector } from '@ngrx/store';
import { ContextState } from '../models.interface';

import * as fromFeature from '../reducers';
import * as fromContext from '../reducers/context.reducer';

export const getContext: MemoizedSelector<ContextState, any> = createSelector(
  fromFeature.getContextState,
  fromContext.getContext
);