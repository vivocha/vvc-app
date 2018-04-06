import { createSelector, MemoizedSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromContext from '../reducers/context.reducer';
import {ContextState} from '../models.interface';

export const getContext:MemoizedSelector<Object,ContextState> = createSelector(
  fromFeature.getContextState,
  fromContext.getContext
);