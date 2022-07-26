import * as fromWidget from '../actions/widget.actions';
import {
  ContextState,
  WidgetState,
  DataCollectionState,
  ChatState,
  MessagesState,
  UiState
} from '../models.interface';

const initialState = {
  context: { loaded: false, translationLoaded: false, isUiLoaded: false },
  media: { isMinimized: false },
  topBar: {},
  protocol: { contactStarted: false }
};

export function reducer(state: WidgetState = initialState, action: fromWidget.WidgetActions): WidgetState {  
  switch (action.type) {
    case fromWidget.WIDGET_CLOSED_BY_AGENT: {
      const context = Object.assign({}, state.context, { closedByAgent: true, showClosePanel: false, isMinimized: false });
      return Object.assign({}, state, { context: context });
    }
    case fromWidget.WIDGET_CLOSED_BY_VISITOR: {
      const context = Object.assign({}, state.context, { closedByVisitor: true, showClosePanel: false });
      return Object.assign({}, state, { context: context });
    }
    case fromWidget.WIDGET_CONTACT_FAILED: {
      const context = Object.assign({}, state.context, {
        isUiLoaded: true,
        contactCreationFailed: true,
        hasError: true,
        showQueuePanel: true
      });
      return Object.assign({}, state, { context: context });
    }
    case fromWidget.WIDGET_CONTACT_NO_AGENTS: {
      const context = Object.assign({}, state.context, {
        isUiLoaded: true,
        contactCreationFailed: true,
        contactCreationNoAgents: true,
        hasError: true,
        showQueuePanel: true
      });
      return Object.assign({}, state, { context: context });
    }
    case fromWidget.WIDGET_HIDE_QUEUE_FOR_CHAT: {
      const chatState: ChatState = {
        isVisible: true,
        canUploadFiles: state.context.variables.showUploadButton,
        canSendEmoji: state.context.variables.showEmojiButton,
        uploadPanelOpened: false,
        emojiPanelOpened: false,
        notRead: 0
      };
      return Object.assign({}, state, {chat: chatState});
    }
    case fromWidget.WIDGET_INIT_CHAT: {
      const hasChat  = state.protocol.initialOffer && state.protocol.initialOffer.Chat;
      const chatState: ChatState = {
        isVisible: hasChat,
        canUploadFiles: state.context.variables.showUploadButton,
        canSendEmoji: state.context.variables.showEmojiButton,
        uploadPanelOpened: false,
        emojiPanelOpened: false,
        notRead: 0
      };
      return Object.assign({}, state, {chat: chatState});
    }
    case fromWidget.WIDGET_INIT_CONTEXT: {
      const context = Object.assign({}, state.context, { ...action.payload});
      if(action.payload.mediaPreset === "sync"){
        context.isMinimized = true;
      }
      return Object.assign({}, state, { context: context} );
    }
    case fromWidget.WIDGET_INIT_MULTIMEDIA: {
      const hasVideo =  state.protocol.initialOffer &&
                        state.protocol.initialOffer.Video &&
                        (state.protocol.initialOffer.Video.rx || state.protocol.initialOffer.Video.tx);
      const hasVoice =  state.protocol.initialOffer &&
                        state.protocol.initialOffer.Voice &&
                        (state.protocol.initialOffer.Voice.rx || state.protocol.initialOffer.Voice.tx);
      const hasChat  = state.protocol.initialOffer && state.protocol.initialOffer.Chat;
      const multimedia = {
        isVisible: hasVoice || hasVideo,
        isMinimized: hasChat,
      };
      return Object.assign({}, state, {media: multimedia});
    }
    case fromWidget.WIDGET_INIT_PROTOCOL: {
      const protocol = Object.assign({}, state.protocol, action.payload);
      return Object.assign({}, state, {protocol: protocol });
    }
    case fromWidget.WIDGET_IS_UPLOADING: {
      const context = Object.assign({}, state.context, {isUploading: true, uploadCompleted: false });
      return Object.assign({}, state, { context: context} );
    }
    case fromWidget.WIDGET_IS_WRITING: {
      const chat = Object.assign({}, state.chat, {isWriting: action.payload});
      return Object.assign({}, state, {chat: chat});
    }
    case fromWidget.WIDGET_MARK_AS_READ: {
      const chat = Object.assign({}, state.chat, {notRead: 0});
      return Object.assign({}, state, {chat: chat});
    }
    case fromWidget.WIDGET_MEDIA_CHANGE: {
      const multimedia = Object.assign({}, state.media, { media: action.payload });
      const protocol = Object.assign({}, state.protocol, {incomingOffer: false, isOffering: false, offeringMedia: ''});
      return Object.assign({}, state, {media: multimedia, protocol: protocol});
    }
    case fromWidget.WIDGET_INCOMING_MEDIA: {
      const protocol = Object.assign({}, state.protocol, {incomingMedia: action.payload, incomingOffer: true});
      const multimedia = Object.assign({}, state.media, { isVisible: true });
      const context = Object.assign({}, state.context, { isMinimized: false });

      return Object.assign({}, state, {protocol: protocol, media: multimedia, context: context });
    }
    case fromWidget.WIDGET_MEDIA_OFFER: {
      const protocol = Object.assign({}, state.protocol, {offer: action.payload});
      return Object.assign({}, state, {protocol: protocol});
    }
    case fromWidget.WIDGET_IS_OFFERING: {
      const protocol = Object.assign({}, state.protocol, {offeringMedia: action.payload, isOffering: true});
      const multimedia = Object.assign({}, state.media, { isVisible: true });
      return Object.assign({}, state, {protocol: protocol, media: multimedia });
    }
    case fromWidget.WIDGET_IN_VIDEO_TRANSIT: {
      const protocol = Object.assign({}, state.protocol, {inVideoTransit: action.payload});
      return Object.assign({}, state, {protocol: protocol});
    }
    case fromWidget.WIDGET_MUTE_IN_PROGRESS: {
      const multimedia = Object.assign({}, state.media, { muteInProgress: true });
      return Object.assign({}, state, {media: multimedia });
    }
    case fromWidget.WIDGET_MUTE_SUCCESS: {
      const multimedia = Object.assign({}, state.media, { muteInProgress: false, isMuted: action.payload });
      return Object.assign({}, state, {media: multimedia });
    }
    case fromWidget.WIDGET_NEW_MESSAGE: {
      if (
          state.context.isMinimized ||
          state.context.cbnMode ||
          !state.chat.isVisible ||
          (state.media.isVisible && !state.media.isMinimized) ||
          (state.context.isFullScreen && !state.chat.showOnFullScreen)
      ) {
        let tmpChat: ChatState = Object.assign({}, state.chat);
        if (state.chat) {
          tmpChat = Object.assign(tmpChat, {notRead: state.chat.notRead + 1});
        } else {
          tmpChat = Object.assign(tmpChat, {notRead: 1});
        }
        return Object.assign({}, state, {chat: tmpChat});
      } else {
        return state;
      }
    }
    case fromWidget.WIDGET_OFFER_ACCEPTED: {
      const protocol = Object.assign({}, state.protocol, {incomingOffer: false, isOffering: false, offeringMedia: ''});
      return Object.assign({}, state, {protocol: protocol});
    }
    case fromWidget.WIDGET_OFFER_REJECTED: {
      const protocol = Object.assign({}, state.protocol, {incomingOffer: false, isOffering: false, offeringMedia: ''});
      return Object.assign({}, state, {protocol: protocol});
    }
    case fromWidget.WIDGET_SET_AGENT: {
      const chat = Object.assign({}, state.chat, {isAutoChat: false});
      const context = Object.assign({}, state.context, {showQueuePanel: false});
      return Object.assign({}, state, {agent: action.payload, context: context, chat: chat});
    }
    case fromWidget.WIDGET_SET_AUTO_CHAT: {
      const chatState: ChatState = {
        isVisible: true,
        isAutoChat: true,
        canUploadFiles: false,
        canSendEmoji: false,
        uploadPanelOpened: false,
        emojiPanelOpened: false,
        notRead: 0
      };
      return Object.assign({}, state, {chat: chatState});
    }
    case fromWidget.WIDGET_SET_CBN_MODE: {
      const context = Object.assign({}, state.context, {cbnMode: action.payload});
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SET_CBN_STATE: {
      const context = Object.assign({}, state.context, {cbnState: action.payload});
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SET_INBOUND_MODE: {
      const context = Object.assign({}, state.context, {inboundState: action.payload, inboundMode: true });
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SET_INBOUND_STATE: {
      const inboundState = Object.assign({}, state.context.inboundState, {state: action.payload});
      const context = Object.assign({}, state.context, {inboundState: inboundState });
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SET_DIALOG_UI: {
      const chatState: ChatState = {
        isVisible: true,
        canUploadFiles: false,
        canSendEmoji: false,
        uploadPanelOpened: false,
        emojiPanelOpened: false,
        notRead: 0
      };
      const context = Object.assign({}, state.context, {showQueuePanel: false});
      return Object.assign({}, state, {chat: chatState, context: context});
    }
    case fromWidget.WIDGET_SET_ERROR: {
      const context = Object.assign({}, state.context, {hasError: true, showQueuePanel: true});
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SET_FULLSCREEN: {
      const context = Object.assign({}, state.context, {isFullScreen: true, isMinimized: false});
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SET_MINIMIZED: {
      const context = Object.assign({}, state.context, {isMinimized: true, isFullScreen: false});
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SET_MINIMIZED_MEDIA: {
      const multimedia = Object.assign({}, state.media, { isMinimized: action.payload });
      return Object.assign({}, state, {media: multimedia});
    }
    case fromWidget.WIDGET_SET_NORMAL: {
      const context = Object.assign({}, state.context, {isMinimized: false, isFullScreen: false});
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SET_TOP_BAR: {
      const topBar = Object.assign({}, state.topBar, action.payload);
      return Object.assign({}, state, {topBar: topBar});
    }
    case fromWidget.WIDGET_SHOW_CHAT_FULLSCREEN: {
      const chat = Object.assign({}, state.chat, {showOnFullScreen: action.payload});
      return Object.assign({}, state, {chat: chat});
    }
    case fromWidget.WIDGET_SHOW_CLOSE_PANEL: {
      const context = Object.assign({}, state.context, {showClosePanel: action.payload});
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SHOW_QUEUE_PANEL: {
      const context = Object.assign({}, state.context, {showQueuePanel: true});
      return Object.assign({}, state, {context: context});
    }
    case fromWidget.WIDGET_SHOW_UPLOAD_PANEL: {
      const chat = Object.assign({}, state.chat, {uploadPanelOpened: action.payload, emojiPanelOpened: false});
      return Object.assign({}, state, {chat: chat});
    }
    case fromWidget.WIDGET_TOGGLE_EMOJI: {
      const chat = Object.assign({}, state.chat, {emojiPanelOpened: !state.chat.emojiPanelOpened, uploadPanelOpened: false});
      return Object.assign({}, state, { chat: chat });
    }
    case fromWidget.WIDGET_UI_READY: {
      const context = Object.assign({}, state.context, { isUiLoaded: true});
      return Object.assign({}, state, { context: context} );
    }
    case fromWidget.WIDGET_UPDATE_LOCAL_CAPS: {
      const protocol = Object.assign({}, state.protocol, {localCaps: action.payload });
      return Object.assign({}, state, { protocol: protocol });
    }
    case fromWidget.WIDGET_UPDATE_REMOTE_CAPS: {
      const protocol = Object.assign({}, state.protocol, {remoteCaps: action.payload });
      return Object.assign({}, state, { protocol: protocol });
    }
    case fromWidget.WIDGET_UPLOAD_COMPLETED: {
      const context = Object.assign({}, state.context, {isUploading: false, uploadCompleted: true });
      const chat = Object.assign({}, state.chat, {uploadPanelOpened: false});
      return Object.assign({}, state, { context: context, chat: chat });
    }
    case fromWidget.WIDGET_UPGRADE_CBN_TO_CHAT: {
      const context = Object.assign({}, state.context, {cbnMode: false});
      return Object.assign({}, state, { context: context });
    }
    case fromWidget.WIDGET_UPGRADE_INBOUND_TO_CHAT: {
      const context = Object.assign({}, state.context, {inboundMode: false});
      return Object.assign({}, state, { context: context });
    }
    case fromWidget.WIDGET_WEBLEAD_SENT: {
      const context = Object.assign({}, state.context, {hasError: true, showQueuePanel: true, webleadSent: true});
      return Object.assign({}, state, {context: context});
    }
    default: return state;
  }

}


export const getContextRedux = (state: WidgetState): ContextState => state.context;
export const getUiStateRedux = (
  widgetState: WidgetState,
  messagesState: MessagesState,
  dataCollectionState: DataCollectionState
): UiState => {
  const hasMultimedia           = widgetState.media.media;
  const hasAudio                = hasMultimedia &&
                                  widgetState.media.media.Voice &&
                                  widgetState.media.media.Voice.via !== 'pstn' &&
                                  (widgetState.media.media.Voice.rx || widgetState.media.media.Voice.tx);
  const hasVideo                = hasMultimedia && widgetState.media.media.Video;
  const hasLocalVideo           = hasVideo && widgetState.media.media.Video.tx;
  const hasRemoteVideo          = hasVideo && widgetState.media.media.Video.rx;
  const hasLocalVideoStream     = hasLocalVideo &&
                                  widgetState.media.media.Video.data &&
                                  widgetState.media.media.Video.data.tx_stream &&
                                  !!widgetState.media.media.Video.data.tx_stream.media;
  const localVideoStream        = (hasLocalVideoStream) ? widgetState.media.media.Video.data.tx_stream.media :  false;
  const hasRemoteVideoStream    = hasRemoteVideo &&
                                  widgetState.media.media.Video.data &&
                                  widgetState.media.media.Video.data.rx_stream &&
                                  !!widgetState.media.media.Video.data.rx_stream.media;
  const remoteVideoStream       = (hasRemoteVideoStream) ? widgetState.media.media.Video.data.rx_stream.media : false;
  const hasAudioStream          = hasAudio &&
                                  widgetState.media.media.Voice.data &&
                                  widgetState.media.media.Voice.data.rx_stream &&
                                  !!widgetState.media.media.Voice.data.rx_stream.media;
  const hasScreenStream         = widgetState.media.media &&
                                  widgetState.media.media.Screen &&
                                  widgetState.media.media.Screen.data &&
                                  widgetState.media.media.Screen.data.rx_stream &&
                                  !!widgetState.media.media.Screen.data.rx_stream.media;
  const audioRxStream           = (hasAudioStream) ? widgetState.media.media.Voice.data.rx_stream.media : false;
  const screenRxStream          = (hasScreenStream) ? widgetState.media.media.Screen.data.rx_stream.media : false;
  const isAudioConnecting       = hasAudio && !hasAudioStream;
  const isAudioConnected        = hasAudio && hasAudioStream;
  const isLocalVideoConnecting  = hasLocalVideo && !hasLocalVideoStream;
  const isRemoteVideoConnecting = hasRemoteVideo && !hasRemoteVideoStream;
  const isLocalVideoConnected   = hasLocalVideo && hasLocalVideoStream;
  const isRemoteVideoConnected  = hasRemoteVideo && hasRemoteVideoStream;
  const isVideoConnecting       = isLocalVideoConnecting || isRemoteVideoConnecting;
  const isVideoConnected        = isLocalVideoConnected || isRemoteVideoConnected;
  const isMediaConnected        = isAudioConnected || isLocalVideoConnected || isRemoteVideoConnected || screenRxStream;
  const isMediaConnecting       = isAudioConnecting || isVideoConnecting;
  const isMediaVisible          = widgetState.chat &&
                                  !widgetState.chat.uploadPanelOpened &&
                                  (
                                    widgetState.protocol.incomingOffer ||
                                    widgetState.protocol.isOffering ||
                                    isMediaConnecting ||
                                    isMediaConnected
                                  );
  const canRemoveApp            = widgetState.context.webleadSent ||
                                  widgetState.context.closedByAgent ||
                                  widgetState.context.closedByVisitor ||
                                  widgetState.context.showQueuePanel ||
                                  !widgetState.context.isUiLoaded ||
                                  (dataCollectionState.selectedItem && !dataCollectionState.completed);
  const canLocalAudio           = widgetState.protocol.localCaps &&
                                  widgetState.protocol.localCaps.Media &&
                                  widgetState.protocol.localCaps.Media.Voice &&
                                  widgetState.protocol.localCaps.Media.Voice.Engines &&
                                  widgetState.protocol.localCaps.Media.Voice.Engines.WebRTC;
  const canLocalVideo           = widgetState.protocol.localCaps &&
                                  widgetState.protocol.localCaps.Media &&
                                  widgetState.protocol.localCaps.Media.Video &&
                                  widgetState.protocol.localCaps.Media.Video.Engines &&
                                  widgetState.protocol.localCaps.Media.Video.Engines.WebRTC;
  const canSwitchCamera         = canLocalVideo && widgetState.protocol.localCaps.WebRTC.VideoMultipleDevices;
  const canStartAudio           = widgetState.protocol.canStartAudio &&
                                  !hasAudio &&
                                  !isAudioConnecting &&
                                  widgetState.agent &&
                                  widgetState.agent.is_agent &&
                                  widgetState.protocol.offeringMedia !== 'Voice' &&
                                  (
                                    widgetState.protocol.remoteCaps &&
                                    widgetState.protocol.remoteCaps.MediaAvailability &&
                                    widgetState.protocol.remoteCaps.MediaAvailability.Voice
                                  );
  const canStartVideo           = widgetState.protocol.canStartVideo &&
                                  (
                                    widgetState.protocol.remoteCaps &&
                                    widgetState.protocol.remoteCaps.MediaAvailability &&
                                    widgetState.protocol.remoteCaps.MediaAvailability.Video
                                  ) &&
                                  (
                                    widgetState.protocol.remoteCaps &&
                                    widgetState.protocol.remoteCaps.MediaAvailability &&
                                    widgetState.protocol.remoteCaps.MediaAvailability.Voice
                                  ) &&
                                  widgetState.agent &&
                                  widgetState.agent.is_agent &&
                                  !hasLocalVideo &&
                                  !isVideoConnecting;
  const hideTopBarInfo          = ((widgetState.context.showQueuePanel) || widgetState.context.cbnMode || widgetState.context.inboundMode ||
                                  (isMediaVisible && !widgetState.media.isMinimized && !widgetState.context.isFullScreen)) ||
                                  widgetState.protocol.isOffering ||
                                  widgetState.protocol.incomingOffer;
  const isClosed                = widgetState.context.closedByAgent ||
                                  widgetState.context.closedByVisitor ||
                                  widgetState.context.webleadSent ||
                                  widgetState.context.hasError;
  const isChatVisible           = widgetState.chat &&
                                  !widgetState.context.showQueuePanel &&
                                  !dataCollectionState.showDataCollectionPanel &&
                                  !widgetState.protocol.isOffering &&
                                  !widgetState.protocol.incomingOffer &&
                                  !isMediaConnecting &&
                                  ((!isMediaConnected || isMediaConnected && widgetState.media.isMinimized) ||
                                  widgetState.context.isFullScreen);
  const isChatBoxVisible        = isChatVisible &&
                                  (
                                    !isClosed ||
                                    (
                                      dataCollectionState.selectedItem &&
                                      dataCollectionState.selectedItem.dc.type === 'dialog' &&
                                      dataCollectionState.lastCompleted.type !== 'survey'
                                    )
                                  );
  const is_bot                  = widgetState.agent ? (widgetState.agent.is_bot ? true : false) : false;
  const canUploadFile           = widgetState.chat && widgetState.chat.canUploadFiles &&
                                    (
                                      is_bot
                                      ? 
                                        true
                                      :
                                        (
                                          widgetState.protocol.remoteCaps &&
                                          widgetState.protocol.remoteCaps.Media &&
                                          widgetState.protocol.remoteCaps.Media.Sharing &&
                                          widgetState.protocol.remoteCaps.Media.Sharing.FileTransfer
                                        )
                                    );

  const canMinimize = widgetState.context.campaign ? !(widgetState.context.campaign.channels.web.interaction || {}).selector : true;

try {
  console.log("%c[canLocalVideo]", "color:Thistle; font-weight: bold;", canLocalVideo);
  console.log("%c[canStartVideo]", "color:Thistle; font-weight: bold;", canStartVideo);
  console.log("%c[both]", "color:Thistle; font-weight: bold;", canLocalVideo && canStartVideo);

  console.log("%c[widgetState]", "color:Thistle; font-weight: bold;", widgetState);
  console.log("%c[widgetState.protocol.canStartVideo]", "color:Thistle; font-weight: bold;", widgetState.protocol.canStartVideo);
  console.log("%c[widgetState.agent]", "color:Thistle; font-weight: bold;", widgetState.agent);
  console.log("%c[widgetState.agent.is_agent]", "color:Thistle; font-weight: bold;", widgetState.agent.is_agent);
  console.log("%c[!hasLocalVideo]", "color:Thistle; font-weight: bold;", !hasLocalVideo);
  console.log("%c[!isVideoConnecting]", "color:Thistle; font-weight: bold;", !isVideoConnecting);
} catch (e){
  console.error(e)
}

  return {
    agent: widgetState.agent,
    messages: [...messagesState.list],
    variables: widgetState.context.variables || {},
    canMaximize: isVideoConnected || screenRxStream,
    canMinimize: canMinimize,
    canRemoveApp: canRemoveApp,
    canStartAudio: canLocalAudio && canStartAudio,
    canStartVideo: canLocalVideo && canStartVideo,
    canUploadFile: canUploadFile,
    cbnMode: widgetState.context.cbnMode && !widgetState.context.showQueuePanel,
    cbnState: widgetState.context.cbnState,
    connectedWithAgent: widgetState.agent && widgetState.agent.is_agent,
    connectedWithBot: widgetState.agent && widgetState.agent.is_bot,
    contactCreationFailed: widgetState.context.contactCreationFailed,
    contactCreationNoAgents: widgetState.context.contactCreationNoAgents,
    contactStarted: widgetState.protocol.contactStarted,
    hasError: widgetState.context.hasError,
    hasMultipleVideoDevice: canSwitchCamera,
    hasSurvey: !!widgetState.context.surveyId,
    inboundMode: widgetState.context.inboundMode && !widgetState.context.showQueuePanel,
    inboundState: widgetState.context.inboundState,
    incomingOffer: widgetState.protocol.incomingOffer,
    incomingMedia: widgetState.protocol.incomingMedia,
    inVideoTransit: widgetState.protocol.inVideoTransit,
    isAutoChat: widgetState.chat && widgetState.chat.isAutoChat,
    isLoading: !widgetState.context.isUiLoaded,
    isInQueue: widgetState.context.showQueuePanel && (dataCollectionState.completed || widgetState.context.contactCreationFailed),
    isChatVisible: isChatVisible && !widgetState.context.cbnMode && !widgetState.context.inboundMode,
    isChatBoxVisible: isChatBoxVisible,
    isClosed: isClosed,
    isClosedByAgent: widgetState.context.closedByAgent,
    isClosedByVisitor: widgetState.context.closedByVisitor,
    isMediaConnected: isMediaConnected,
    isMediaConnecting: isMediaConnecting,
    isMediaVisible: isMediaVisible,
    isMediaMinimized: widgetState.media.isMinimized && !widgetState.protocol.isOffering && !widgetState.protocol.incomingOffer,
    isMinimized: widgetState.context.isMinimized,
    isMobile: widgetState.context.isMobile,
    isMuted: widgetState.media.isMuted,
    isOffering: widgetState.protocol.isOffering,
    isFullScreen: widgetState.context.isFullScreen && !isClosed,
    isSendAreaVisible: isChatBoxVisible,
    isUploading: widgetState.context.isUploading,
    isWriting:  widgetState.chat && widgetState.chat.isWriting && !isClosed,
    language: widgetState.context.language,
    notRead: (widgetState.chat) ? widgetState.chat.notRead : 0,
    offeringMedia: widgetState.protocol.offeringMedia,
    selectedDataCollection: dataCollectionState.selectedItem,
    showCloseModal: widgetState.context.showClosePanel,
    showChatOnFullScreen: widgetState.chat && widgetState.chat.showOnFullScreen,
    showDataCollectionPanel: dataCollectionState.showDataCollectionPanel,
    showEmojiPanel:  widgetState.chat && widgetState.chat.emojiPanelOpened,
    showUploadPanel:  widgetState.chat && widgetState.chat.uploadPanelOpened,
    topBarTitle: (hideTopBarInfo) ? '' : widgetState.topBar.title,
    topBarSubtitle: (hideTopBarInfo) ? '' : widgetState.topBar.subtitle,
    topBarAvatar: (hideTopBarInfo) ? '' : widgetState.topBar.avatar,
    translationLoaded: widgetState.context.translationLoaded,
    uploadCompleted: widgetState.context.uploadCompleted,
    voiceRxStream: audioRxStream,
    videoRxStream: remoteVideoStream,
    videoTxStream: localVideoStream,
    screenRxStream: screenRxStream,
    webleadSent: widgetState.context && widgetState.context.webleadSent,
    isRemoteVideoConnecting: isRemoteVideoConnecting,
    isLocalVideoConnecting: isLocalVideoConnecting
  }
};
