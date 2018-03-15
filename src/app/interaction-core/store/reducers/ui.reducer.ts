import {
  ChatState, ClosePanelState, ContextState, EventState, LoadingPanelState, TopBarState, UiState,
  WidgetState, MessagesState
} from '../models.interface';

export const getUiLoadingPanelState = (contextState: ContextState):LoadingPanelState => {
  return {
    visible: !contextState.loaded
  }
};

export const getUiClosePanelState = (widgetState: WidgetState): ClosePanelState => {
  return {
    visible: false
  }
};

export const getUiTopBarState = (widgetState: WidgetState): TopBarState => {
  return {
    canMinimize: true
  }
};

export const getUiChatState = (contextState: ContextState, widgetState: WidgetState, eventState: EventState): ChatState => {
  const isChatVisible = (contextState.requestedMedia === 'chat');
  const isSendAreaDisabled = eventState && eventState.name === 'QUEUE';
  const showEmojiButton = contextState.variables && contextState.variables.showEmojiButton;
  const showUploadButton = contextState.variables && contextState.variables.showUploadButton;

  return {
    isChatVisible: isChatVisible,
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
  return {
    loadingPanel: loadingPanelState,
    closePanel: closePanelState,
    topBar: topBarState,
    chat: chatState,
    messages: messagesState.list
  }
};