import { createSelector, MemoizedSelector } from '@ngrx/store';

import {ContextState} from '../models.interface';
import {getContextState} from '../reducers/main.reducer';
import {getContextRedux} from '../reducers/context.reducer';

export const getContext:MemoizedSelector<Object,ContextState> = createSelector(
  getContextState,
  getContextRedux
);