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
/*
export const getUiTopBarState = (widgetState: WidgetState): TopBarState => {
  const canRemoveApp = widgetState.isInQueue || widgetState.closedByVisitor || widgetState.closedByAgent;
  return {
    canMinimize: true,
    canMaximize: false,
    canStartAudio: false,
    canStartVideo: false,
    canRemoveApp: canRemoveApp,
    title: (widgetState && widgetState.topBar && widgetState.topBar.title) ? widgetState.topBar.title : '',
    subtitle: (widgetState && widgetState.topBar && widgetState.topBar.subtitle) ? widgetState.topBar.subtitle : '',
    avatar: (widgetState && widgetState.topBar && widgetState.topBar.avatar) ? widgetState.topBar.avatar : '',
  }
};
export const getUiChatState = (contextState: ContextState, widgetState: WidgetState): ChatState => {
  const isChatVisible = (contextState.requestedMedia === 'chat' && widgetState.isLoading === false);
  const isSendAreaDisabled = widgetState.isInQueue;
  const isSendAreaVisible = (!!widgetState.closedByAgent === false && !!widgetState.closedByVisitor === false);
  const showEmojiButton = contextState.variables && contextState.variables.showEmojiButton;
  const showUploadButton = contextState.variables && contextState.variables.showUploadButton;
  const showAvatarOnIsWriting = contextState.variables && contextState.variables.showAvatarOnIsWriting;


  return {
    isChatVisible: isChatVisible,
    isSendAreaVisible: isSendAreaVisible,
    isSendAreaDisabled: isSendAreaDisabled,
    showEmojiButton: showEmojiButton,
    showUploadButton: false,
    showSendButton: true,
    showAvatarOnIsWriting: showAvatarOnIsWriting,
    isWriting: widgetState.isWriting,
    isWritingAvatar: (widgetState.agent) ? widgetState.agent.avatar: '',
    isWritingNick: (widgetState.agent) ? widgetState.agent.nick: ''
  }
};

export const getUiState = (widgetState: WidgetState, topBarState: TopBarState, chatState: ChatState, messagesState: MessagesState): UiState => {
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
    agent: widgetState.agent,
    isWriting: widgetState.isWriting,
    isLoading: widgetState.isLoading,
    showCloseModal: widgetState.showCloseModal,
    showEmojiPanel: widgetState.showEmojiPanel,
    isMinimized: widgetState.isMinimized,
    topBar: topBarState,
    chat: chatState,
    messages: [...messages],
    not_read: widgetState.not_read
  }
};
*/
export const getUiState = (
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