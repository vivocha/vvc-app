import * as fromWidget from '../actions/widget.actions';
import {ContextState, WidgetState, DataCollectionState, ChatState, MessagesState, UiState, SurveyState} from '../models.interface';

const initialState = {
  context: { loaded: false }
};

export function reducer(state: WidgetState = initialState, action: fromWidget.WidgetActions): WidgetState{
  switch (action.type){
    case fromWidget.WIDGET_CLOSED_BY_AGENT:{
      const context = Object.assign({}, state.context, { closedByAgent: true, showClosePanel: false });
      return Object.assign({}, state, { context: context });
    }

    case fromWidget.WIDGET_CLOSED_BY_VISITOR:{
      const context = Object.assign({}, state.context, { closedByVisitor: true, showClosePanel: false });
      return Object.assign({}, state, { context: context });
    }

    case fromWidget.WIDGET_INIT_CHAT: {
      const chatState: ChatState = Object.assign({
        isVisible: state.protocol.requestedMedia === 'chat',
        canUploadFiles: state.context.variables.showUploadButton,
        canSendEmoji: state.context.variables.showEmojiButton,
        uploadPanelOpened: false,
        emojiPanelOpened: false,
        notRead: 0
      });
      return Object.assign({}, state, {chat: chatState});
    }

    case fromWidget.WIDGET_INIT_CONTEXT: {
      return Object.assign({}, state, {context: { ...action.payload, isUiLoaded: true, showQueuePanel: true }});
    }

    case fromWidget.WIDGET_INIT_MULTIMEDIA: {
      const multimedia = {
        isVisible: (state.protocol.requestedMedia === 'video' || state.protocol.requestedMedia === 'voice'),
        isMinimized: false
      };
      return Object.assign({}, state, {media: multimedia});
    }

    case fromWidget.WIDGET_INIT_PROTOCOL: {
      return Object.assign({}, state, {protocol: action.payload});
    }

    case fromWidget.WIDGET_IS_WRITING: {
      const chat = Object.assign({}, state.chat, {isWriting: action.payload});
      return Object.assign({}, state, {chat: chat});
    }

    case fromWidget.WIDGET_MARK_AS_READ: {
      const chat = Object.assign({}, state.chat, {notRead: 0});
      return Object.assign({}, state, {chat: chat});
    }

    case fromWidget.WIDGET_NEW_MESSAGE: {
      if (state.context.isMinimized || !state.chat.isVisible) {
        const chat = Object.assign({}, state.chat, {notRead: state.chat.notRead+1});
        return Object.assign({}, state, {chat: chat});
      }
      else return state;
    }

    case fromWidget.WIDGET_SET_AGENT: {
      const context = Object.assign({}, state.context, {showQueuePanel: false});
      return Object.assign({}, state, {agent: action.payload, context: context});
    }

    case fromWidget.WIDGET_SET_MINIMIZED:{
      const context = Object.assign({}, state.context, {isMinimized: true});
      return Object.assign({}, state, {context: context});
    }

    case fromWidget.WIDGET_SET_NORMAL:{
      const context = Object.assign({}, state.context, {isMinimized: false});
      return Object.assign({}, state, {context: context});
    }

    case fromWidget.WIDGET_SHOW_CLOSE_PANEL:{
      const context = Object.assign({}, state.context, {showClosePanel: action.payload});
      return Object.assign({}, state, {context: context});
    }

    case fromWidget.WIDGET_SHOW_UPLOAD_PANEL: {
      const chat = Object.assign({}, state.chat, {uploadPanelOpened: action.payload});
      return Object.assign({}, state, {chat: chat});
    }

    case fromWidget.WIDGET_TOGGLE_EMOJI:{
      const chat = Object.assign({}, state.chat, {emojiPanelOpened: !state.chat.emojiPanelOpened});
      return Object.assign({}, state, { chat: chat });
    }

    default: return state;
  }
}


export const getContextRedux = (state: WidgetState):ContextState => state.context;
export const getUiStateRedux = (
  widgetState: WidgetState,
  messagesState: MessagesState,
  dataCollectionState: DataCollectionState,
  surveyState: SurveyState): UiState => {
    return {
      agent: widgetState.agent,
      messages: [...messagesState.list],
      variables: widgetState.context.variables || {},
      canRemoveApp: widgetState.context.closedByAgent || widgetState.context.closedByVisitor || widgetState.context.showQueuePanel || !widgetState.context.isUiLoaded,
      connectedWithAgent: widgetState.agent && widgetState.agent.is_agent,
      connectedWithBot: widgetState.agent && widgetState.agent.is_bot,
      isLoading: !widgetState.context.isUiLoaded,
      isInQueue: widgetState.context.showQueuePanel,
      isChatVisible:  widgetState.chat && widgetState.chat.isVisible,
      isClosed: widgetState.context.closedByAgent || widgetState.context.closedByVisitor,
      isClosedByAgent: widgetState.context.closedByAgent,
      isClosedByVisitor: widgetState.context.closedByVisitor,
      isMediaVisible: widgetState.media && widgetState.media.isVisible,
      isMediaMinimized: false,
      isMinimized: widgetState.context.isMinimized,
      isMobile: widgetState.context.isMobile,
      isFullScreen: widgetState.context.isFullScreen,
      isSendAreaVisible:  widgetState.chat && widgetState.chat.isVisible && !widgetState.chat.uploadPanelOpened,
      isWriting:  widgetState.chat && widgetState.chat.isWriting,
      notRead: (widgetState.chat) ? widgetState.chat.notRead : 0,
      showCloseModal: widgetState.context.showClosePanel,
      showChatOnFullScreen: widgetState.chat && widgetState.chat.showOnFullScreen,
      showDataCollectionPanel: !dataCollectionState.completed && dataCollectionState.selectedItem,
      showEmojiPanel:  widgetState.chat && widgetState.chat.emojiPanelOpened,
      showUploadPanel:  widgetState.chat && widgetState.chat.uploadPanelOpened,
      showSurveyPanel: !surveyState.completed && surveyState.item
    }
};