import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromMessages from '../reducers/messages.reducer';

export const getMessages = createSelector(
  fromFeature.getMessagesState,
  fromMessages.getMessages
);