export interface ContextState {
  loaded: boolean;
  isMobile?: boolean;
  busId?: string;
  world?: string;
  acct?: string;
  [id:string]: any
}
export interface MessagesState {
  messages: any[]
}
export interface WidgetState {
  dataCollections?: any[];
  selectedDataCollection?: number;
  filledDataCollections?: any[];
  localCaps?: any;
  remoteCaps?: any;
  mediaChange?: any;
  mediaOffer?: any;
  agent?: any;
}

export interface LoadingPanelState {
  visible: boolean;
}
export interface ClosePanelState {
  visible: boolean;
}
export interface TopBarState {
  title?: string;
  subtitle?: string;
  avatarSrc?: string;
  useAvatar?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  canStartAudio?: boolean;
  canStartVideo?: boolean;
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
}
export interface UiState {
  loadingPanel: LoadingPanelState;
  closePanel: ClosePanelState;
  topBar: TopBarState;
  chat: ChatState;
}
/*
export interface UiState {
  loading: boolean;
  dataCollections?: any[];
  selectedDataCollection?: number;
  filledDataCollections?: any[];
  localCaps?: any;
  remoteCaps?: any;
  mediaChange?: any;
  mediaOffer?: any;
  agent?: any;
}
export interface WidgetState {
  agent?: VvcAgent;
  askForTranscript?: boolean;
  canAddVideo?: boolean;
  canAddVoice?: boolean;
  changeMediaState?: boolean;
  chat: boolean;
  chatVisibility?: boolean;
  closed: boolean;
  dataCollectionPanel?: boolean;
  dataCollections?: VvcDataCollection;
  error?: boolean;
  fullScreen: boolean;
  had_chat?: boolean;
  hasDataCollection?: boolean;
  hasSurvey?: boolean;
  incomingRequest?: boolean;
  incomingOffer?: VvcOffer;
  initialDataFilled?: boolean;
  isAgentWriting?: boolean;
  lastError?: string;
  state: 'initializing' | 'waiting_data' | 'queue' | 'ready';
  localCaps?: any;
  mediaOffering?: boolean;
  minimized: boolean;
  mobile: boolean;
  mute?: boolean;
  mute_in_progress?: boolean;
  not_read?: number;
  remoteCaps?: any;
  selectedDataCollectionId?: string;
  sharing: boolean;
  showSurvey?: boolean;
  surveyId?: string;
  topBarExpanded: boolean;
  voice: boolean;
  voice_rx?: any;
  voice_tx?: any;
  video: boolean;
  video_rx?: any;
  video_tx?: any;
}
*/
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