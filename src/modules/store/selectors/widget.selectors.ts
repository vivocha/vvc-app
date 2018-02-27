import {createSelector, MemoizedSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromWidget from '../reducers/widget.reducer';
import { WidgetState } from "../models.interface";

export const getWidget: MemoizedSelector<WidgetState, any> = createSelector(
  fromFeature.getWidgetState,
  fromWidget.getWidget
)