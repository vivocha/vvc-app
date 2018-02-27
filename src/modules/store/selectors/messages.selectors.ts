import { createSelector, MemoizedSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromMessages from '../reducers/messages.reducer';

export const getMessages: MemoizedSelector<any, any> = createSelector(
  fromFeature.getMessagesState,
  fromMessages.getMessages
);