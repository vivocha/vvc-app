import { createSelector, MemoizedSelector } from '@ngrx/store';
import {
  getWidgetState,
  getMessagesState,
  getDataCollectionState
} from '../reducers/main.reducer';
import {getUiStateRedux} from '../reducers/widget.reducer';
import {getMessageRedux} from '../reducers/messages.reducer';
import {UiState, MessagesState, DataCollectionState, DataCollectionCompleted} from '../models.interface';
import {getCompletedDC} from '../reducers/dataCollection.reducer';

export const getMessages:MemoizedSelector<Object,MessagesState> = createSelector(
  getMessagesState,
  getMessageRedux
);

export const getUiState:MemoizedSelector<Object,UiState> = createSelector(
  getWidgetState,
  getMessages,
  getDataCollectionState,
  getUiStateRedux
);

export const getDataCollectionCompleted: MemoizedSelector<Object, DataCollectionCompleted> = createSelector(
  getDataCollectionState,
  getCompletedDC
);