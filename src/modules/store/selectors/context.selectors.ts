import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromContext from '../reducers/context.reducer';

export const getContext = createSelector(
  fromFeature.getContextState,
  fromContext.getContext
);