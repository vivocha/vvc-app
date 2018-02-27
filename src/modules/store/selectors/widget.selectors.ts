import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromWidget from '../reducers/widget.reducer';

export const getWidget = createSelector(
  fromFeature.getWidgetState,
  fromWidget.getWidget
)