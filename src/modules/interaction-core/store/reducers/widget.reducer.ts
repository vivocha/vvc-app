import * as fromWidget from '../actions/widget.actions';
import {
  ChatState, ContextState, DataCollectionState, MessagesState, SurveyState, TopBarState, UiState, WidgetState
} from '../models.interface';

const initialState = {
  isLoading: true,
  not_read: 0
}

export function reducer(state: WidgetState = initialState, action: fromWidget.WidgetActions): WidgetState{
  switch (action.type){
    case fromWidget.WIDGET_NEW_STATE:
      return Object.assign({}, state, action.payload);
    default: return state;
  }
}

export const getUiStateRedux = (
  widgetState: WidgetState,
  messagesState: MessagesState,
  dataCollectionState: DataCollectionState,
  surveyState: SurveyState): UiState => {
  const messages = messagesState.list.map( (elem, idx) => {
    let isLast = false;
    let isFirst = false;
    const nextElem = messagesState.list[idx+1];
    const prevElem = messagesState.list[idx-1];
    if (prevElem){
      if (elem.type !== prevElem.type || elem.isAgent != prevElem.isAgent) isFirst = true;
      else isFirst = false;
    }
    else isFirst = true;
    if (nextElem){
      if (elem.type !== nextElem.type || elem.isAgent != nextElem.isAgent) isLast = true;
      else isLast = false;
    }
    else isLast = true;
    let obj = Object.assign({}, elem, { isLast: isLast, isFirst: isFirst });
    return obj;
  });

  return {
    ...widgetState,
    messages: [...messages],
    selectedDataCollection: dataCollectionState.selected,
    selectedSurvey: surveyState.selected
  }
};