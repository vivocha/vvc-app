import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromEvent from '../reducers/event.reducer';

export const getLastEvent = createSelector(
  fromFeature.getEventState,
  fromEvent.getLastEvent
);