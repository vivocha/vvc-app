import {
  AdvancedDataCollection,
  ClientContactCreationOptions,
  ContactDataCollectionForm,
  DataCollection
} from '@vivocha/public-entities/dist';

export type CbnStatus = 'dialing' | 'ringing' | 'busy' | 'no-answer' | 'unassigned' | 'failed' | 'cancel' | 'answer';
export type InboundStateList = 'compose' | 'answer';
export interface InboundStatus {
  formatted: string;
  dnis: string;
  extCode?: string;
  state: InboundStateList;
}
export interface Dimension {
  position: 'fixed' | 'absolute' | 'relative';
  width: string;
  height: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface EventsState {
  type: string;
  data?: any;
}

export interface  ContextState {
  language?: string;
  loaded: boolean;
  cbnMode?: boolean;
  cbnState?: CbnStatus;
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
  webleadSent?: boolean;
  [key: string]: any;
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
  remoteCaps?: any;
  localCaps?: any;
}
export interface AgentState {
  id: string;
  nick: string;
  is_bot: boolean;
  is_agent: boolean;
  avatar?: string;
}
export interface ChatState {
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
export interface MediaState {
  isVisible?: boolean;
  isMinimized?: boolean;
  isMuted?: boolean;
  muteInProgress?: boolean;
  media?: any;
}

export interface DataCollectionDictionary {
  [key: string]: DataCollection;
}
export interface DataCollectionCompleted {
  type: 'dc' | 'survey' | 'recontact' | 'sync';
  contactCreateOptions?: ClientContactCreationOptions;
  dataCollection?: ContactDataCollectionForm;
  lastCompletedType?: 'form' | 'dialog';
}
export interface DataCollectionState {
  items: DataCollectionDictionary;
  dataCollectionIds?: string[];
  surveyId?: string;
  selectedId?: string;
  selectedItem?: { dc: AdvancedDataCollection, type: string };
  showDataCollectionPanel?: boolean;
  lastCompleted?: DataCollectionCompleted;
  completed: boolean;
}
export interface TopBarState {
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
export interface LeftScrollOffset {
 scrollLeft: number;
 messageId: string;
}
export interface BaseMessage {
  id: string;
  text: string;
  type: string;
  ts: Date;
  agent?: any;
  avatar?: string;
  isAgent?: boolean;
  isLast?: string;
  isFirst?: string;
  replied?: boolean;
  time?: string;
}
export interface RequestMessage extends BaseMessage {
  type: 'request';
}
export interface SystemMessage extends BaseMessage {
  type: 'system';
  context?: any;
}
export interface LinkMessage extends BaseMessage {
  url: string;
  from_id: string;
  from_nick: string;
}
export interface ChatMessage extends BaseMessage {
  type: 'chat';

  isBot?: boolean;
  time?: string;
  agent?: any;
  meta?: any;
  visitorNick?: string;

  ack?: string;
  ackIsLate1?: boolean;
  ackIsLate2?: boolean;
  read?: string;
  failed?: boolean;
  tooltipData?: any;
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
  canUploadFile?: boolean;
  cbnMode?: boolean;
  cbnState?: CbnStatus;
  connectedWithAgent: boolean;
  connectedWithBot: boolean;
  contactCreationFailed: boolean;
  contactCreationNoAgents: boolean;
  contactStarted: boolean;
  hasError: boolean;
  hasMultipleVideoDevice: boolean;
  hasSurvey: boolean;
  isAutoChat?: boolean;
  inboundMode?: boolean;
  inboundState?: InboundStatus;
  incomingMedia?: string;
  incomingOffer?: boolean;
  inVideoTransit: boolean;
  isLoading: boolean;
  isInQueue: boolean;
  isChatVisible: boolean;
  isChatBoxVisible: boolean;
  isClosed: boolean;
  isClosedByAgent: boolean;
  isClosedByVisitor: boolean;
  isLocalVideoConnecting: boolean;
  isRemoteVideoConnecting: boolean;
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
  language: string;
  notRead: number;
  offeringMedia: string;
  selectedDataCollection: any;
  showCloseModal: boolean;
  showChatOnFullScreen: boolean;
  showDataCollectionPanel: boolean;
  showEmojiPanel: boolean;
  showUploadPanel: boolean;
  topBarTitle: string;
  topBarSubtitle: string;
  topBarAvatar: string;
  translationLoaded: boolean;
  uploadCompleted: boolean;
  voiceRxStream: streamType;
  videoRxStream: streamType;
  videoTxStream: streamType;
  screenRxStream: streamType;
  webleadSent: boolean;
}
