import {
  ChatState, ClosePanelState, ContextState, EventState, LoadingPanelState, TopBarState, UiState,
  WidgetState, MessagesState
} from '../models.interface';

export const getUiLoadingPanelState = (contextState: ContextState):LoadingPanelState => {
  return {
    visible: !contextState.loaded
  }
};

export const getUiClosePanelState = (eventState: EventState, widgetState: WidgetState): ClosePanelState => {
  const visible = (eventState.name && eventState.name === 'SHOW_CLOSE_MODAL');

  return {
    visible: visible
  }
};

export const getUiTopBarState = (eventState: EventState, widgetState: WidgetState): TopBarState => {
  const canRemoveApp = eventState.name === 'QUEUE' ||
                       eventState.name === 'CLOSED_BY_VISITOR' ||
                       eventState.name === 'CLOSED_BY_AGENT';
  return {
    canMinimize: true,
    canMaximize: false,
    canStartAudio: false,
    canStartVideo: false,
    canRemoveApp: canRemoveApp
  }
};

export const getUiChatState = (contextState: ContextState, widgetState: WidgetState, eventState: EventState): ChatState => {
  const isChatVisible = (contextState.requestedMedia === 'chat');
  const isSendAreaDisabled = eventState.name === 'QUEUE';
  const isSendAreaVisible = eventState.name !== 'CLOSED_BY_VISITOR' && eventState.name !== 'CLOSED_BY_AGENT';
  const showEmojiButton = contextState.variables && contextState.variables.showEmojiButton;
  const showUploadButton = contextState.variables && contextState.variables.showUploadButton;

  return {
    isChatVisible: isChatVisible,
    isSendAreaVisible: isSendAreaVisible,
    isSendAreaDisabled: isSendAreaDisabled,
    showEmojiButton: showEmojiButton,
    showUploadButton: showUploadButton,
    showSendButton: true
  }
};

export const getUiState = (
  loadingPanelState: LoadingPanelState,
  closePanelState: ClosePanelState,
  topBarState: TopBarState,
  chatState: ChatState,
  messagesState: MessagesState
): UiState => {

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
    loadingPanel: loadingPanelState,
    closePanel: closePanelState,
    topBar: topBarState,
    chat: chatState,
    messages: [...messages]
  }
};