export interface  ContextState {
  loaded: boolean;
  closedByAgent?: boolean;
  closedByVisitor?: boolean;
  contactCreationFailed?: boolean;
  isUiLoaded?: boolean;
  isFullScreen?: boolean;
  isMinimized?: boolean;
  isMobile?: boolean;
  isUploading?: boolean;
  uploadCompleted?: boolean;
  showClosePanel?: boolean;
  showQueuePanel?: boolean;
  hasError?: boolean;
  visitorNick?: string;
  [key:string]: any;
}

export interface ProtocolState {
  mediaPreset?: 'chat' | 'video' | 'voice' | 'recall';
  initialOffer?: any;
  canStartAudio?: boolean;
  canStartVideo?: boolean;
  incomingMedia?: string;
  incomingOffer?: boolean;
  inVideoTransit?: boolean;
  isOffering?: boolean;
  offeringMedia?: string;
  contactStarted: boolean;
}
export interface AgentState {
  id: string,
  nick: string,
  is_bot: boolean,
  is_agent: boolean,
  avatar?: string
}
export interface ChatState{
  isAutoChat?: boolean;
  isVisible: boolean;
  isSendAreaVisible?: boolean;
  isChatBoxEnabled?: boolean;
  isWriting?: boolean;
  canUploadFiles: boolean;
  canSendEmoji: boolean;
  uploadPanelOpened: boolean;
  emojiPanelOpened: boolean;
  showSendButton?: boolean;
  notRead: number;
  showOnFullScreen?: boolean;
}
export interface MediaState{
  isVisible?: boolean;
  isMinimized?: boolean;
  isMuted?: boolean;
  muteInProgress?: boolean;
  media?: any;
}
export interface DataCollectionState{
  items?: any[],
  selectedItem?: any;
  completed?: boolean;
  creationOptions?: any;
}
export interface SurveyState{
  item?: any;
  completed?: boolean;
}
export interface TopBarState{
  title?: string;
  subtitle?: string;
  avatar?: string;
}
export interface WidgetState {
  context?: any;
  protocol?: ProtocolState;
  agent?: AgentState;
  chat?: ChatState;
  media?: MediaState;
  topBar?: TopBarState;
}
export interface BaseMessage {
  id: string;
  text: string;
  type: string,
  agent?: any;
  isAgent?: boolean;
  isLast?: string;
  isFirst?: string;
  replied?: boolean;
}
export interface RequestMessage extends BaseMessage{
  type: 'request'
}
export interface SystemMessage extends BaseMessage{
  type: 'system',
  context?: any,
}
export interface ChatMessage extends BaseMessage{
  type: 'chat';

  isBot?: boolean;
  time?: string;
  agent?: any;
  meta?: any;
  visitorNick?: string;
}
export type Message = SystemMessage | ChatMessage | BaseMessage;
export interface MessagesState {
  list: Message[];
}
export type streamType = boolean | string;
export interface UiState {
  agent: AgentState;
  messages: Message[];
  variables: any;
  canMaximize: boolean;
  canMinimize: boolean;
  canRemoveApp: boolean;
  canStartAudio: boolean;
  canStartVideo: boolean;
  connectedWithAgent: boolean;
  connectedWithBot: boolean;
  contactCreationFailed: boolean;
  hasError: boolean;
  hasSurvey: boolean;
  isAutoChat?: boolean;
  incomingMedia?: string;
  incomingOffer?: boolean;
  inVideoTransit: boolean;
  isLoading: boolean;
  isInQueue: boolean;
  isChatVisible: boolean;
  isClosed: boolean;
  isClosedByAgent: boolean;
  isClosedByVisitor: boolean;
  isMediaConnected: boolean;
  isMediaConnecting: boolean;
  isMediaVisible: boolean;
  isMediaMinimized: boolean;
  isMinimized: boolean;
  isMobile: boolean;
  isMuted: boolean;
  isOffering: boolean;
  isFullScreen: boolean;
  isSendAreaVisible: boolean;
  isUploading: boolean;
  isWriting: boolean;
  notRead: number;
  offeringMedia: string;
  selectedDataCollection: any;
  selectedSurvey: any;
  showCloseModal: boolean;
  showChatOnFullScreen: boolean;
  showDataCollectionPanel: boolean;
  showEmojiPanel: boolean;
  showUploadPanel: boolean;
  showSurveyPanel: boolean;
  surveyCompleted: boolean;
  topBarTitle: string;
  topBarSubtitle: string;
  topBarAvatar: string;
  translationLoaded: boolean;
  uploadCompleted: boolean;
  voiceRxStream: streamType;
  videoRxStream: streamType;
  videoTxStream: streamType;
}