export interface  ContextState {
  loaded: boolean;
  closedByAgent?: boolean;
  closedByVisitor?: boolean;
  isUiLoaded?: boolean;
  isFullScreen?: boolean;
  isMinimized?: boolean;
  isMobile?: boolean;
  showClosePanel?: boolean;
  showQueuePanel?: boolean;

  [key:string]: any;
}

export interface ProtocolState {
  requestedMedia?: 'chat' | 'video' | 'voice' | 'recall';
  initialOffer?: any;
  canStartAudio?: boolean;
  canStartVideo?: boolean;
}
export interface AgentState {
  id: string,
  nick: string,
  is_bot: boolean,
  is_agent: boolean,
  avatar?: string
}
export interface ChatState{
  isVisible: boolean;
  isSendAreaVisible: boolean;
  isChatBoxEnabled: boolean;
  isWriting: boolean;
  canUploadFiles: boolean;
  canSendEmoji: boolean;
  uploadPanelOpened: boolean;
  emojiPanelOpened: boolean;
  showSendButton: boolean;
  notRead: number;
  showOnFullScreen: boolean;
}
export interface MediaState{
  isVisible: boolean;
  isMinimized: boolean;
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
export interface WidgetState {
  context?: any;
  protocol?: ProtocolState;
  agent?: AgentState;
  chat?: ChatState;
  media?: MediaState;
}
export interface BaseMessage {
  id: string;
  text: string;
  type: string,
  isAgent?: boolean;
  isLast?: string;
  isFirst?: string;
  replied?: boolean;
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
}
export type Message = SystemMessage | ChatMessage | BaseMessage;
export interface MessagesState {
  list: Message[];
}

export interface UiState {
  agent: AgentState;
  messages: Message[];
  variables: any;
  canRemoveApp: boolean;
  connectedWithAgent: boolean;
  connectedWithBot: boolean;
  isLoading: boolean;
  isInQueue: boolean;
  isChatVisible: boolean;
  isClosed: boolean;
  isClosedByAgent: boolean;
  isClosedByVisitor: boolean;
  isMediaVisible: boolean;
  isMediaMinimized: boolean;
  isMinimized: boolean;
  isMobile: boolean;
  isFullScreen: boolean;
  isSendAreaVisible: boolean;
  isWriting: boolean;
  notRead: number;
  showCloseModal: boolean;
  showChatOnFullScreen: boolean;
  showDataCollectionPanel: boolean;
  showEmojiPanel: boolean;
  showUploadPanel: boolean;
  showSurveyPanel: boolean;
}