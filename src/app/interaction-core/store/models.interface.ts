export interface ContextState {
  loaded: boolean;
  isMobile?: boolean;
  busId?: string;
  world?: string;
  acct?: string;
  [id:string]: any
}
export interface EventState {
  name: string;
  [prop:string]: any;
}
export interface ProtocolState {
  localCaps?: any;
  remoteCaps?: any;
  mediaChange?: any;
  mediaOffer?: any;
}
export interface AgentState {
  nick: string;
  avatar: string;
}
export interface WidgetState {
  agent?: AgentState;
  chat?: ChatState;

  closedByAgent?: boolean;
  closedByVisitor?: boolean;

  isLoading?: boolean;
  isWriting?: boolean;
  isMaximized?: boolean;
  isMinimized?: boolean;
  isInQueue?: boolean;

  not_read?: number;

  protocol? : ProtocolState;
  showCloseModal?: boolean;
  showEmojiPanel?: boolean;
  topBar?: TopBarState;

  [id:string]: any;
}

export interface UiState extends WidgetState{
  messages: any[];
}

export interface TopBarState {
  useAvatar?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  canStartAudio?: boolean;
  canStartVideo?: boolean;
  canRemoveApp?: boolean;
  title?: string;
  subtitle?: string;
  avatar?: string;
}
export interface ChatState {
  emojiPanelVisible?: boolean;
  uploadPanelVisible?: boolean;
  showEmojiButton?: boolean;
  showUploadButton?: boolean;
  showSendButton?: boolean;
  isChatVisible?: boolean;
  isSendAreaVisible?: boolean;
  isSendAreaDisabled?: boolean;
  showAvatarOnIsWriting?: boolean;
  isWriting?: boolean;
  isWritingAvatar?: string;
  isWritingNick?: string;
}

export interface BaseMessage {
  id: string;
  text: string;
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
  isAgent?: boolean;
  isBot?: boolean;
  time?: string;
  agent?: any;
}
export interface MessagesState {
  list: any[];
}

export interface VvcMediaOfferDetails {
  tx: 'required' | 'optional' | 'off';
  rx: 'required' | 'optional' | 'off';
  via?: string;
  engine?: string;
}
export interface VvcOffer {
  Chat?: VvcMediaOfferDetails;
  Voice?: VvcMediaOfferDetails;
  Video?: VvcMediaOfferDetails;
  Screen?: VvcMediaOfferDetails;
  Sharing?: VvcMediaOfferDetails;
}
export interface VvcAvatarImage {
  size?: string;
  file: string;
}
export interface VvcAgentAvatar {
  base_url: string;
  images: VvcAvatarImage[];
}
export interface VvcAgent {
  id: string;
  nick: string;
  avatar?: VvcAgentAvatar;
}
export interface DataCollection {
  status: string;
  type: string;
}
export interface VvcDataCollection {
  [id: string]: DataCollection;
}