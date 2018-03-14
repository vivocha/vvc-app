import {
  ChatState, ClosePanelState, ContextState, LoadingPanelState, TopBarState, UiState,
  WidgetState
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

export const getUiChatState = (widgetState: WidgetState): ChatState => {
  return {
    showEmojiButton: true,
    showSendButton: true
  }
};

export const getUiState = (
  loadingPanelState: LoadingPanelState,
  closePanelState: ClosePanelState,
  topBarState: TopBarState,
  chatState: ChatState
): UiState => {
  return {
    loadingPanel: loadingPanelState,
    closePanel: closePanelState,
    topBar: topBarState,
    chat: chatState
  }
};