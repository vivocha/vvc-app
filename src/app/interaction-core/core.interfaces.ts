export type VvcTxRxTypes = 'required' | 'optional' | 'off';
export type WidgetState = 'initializing' | 'waiting_data' | 'queue' | 'ready';
export interface VvcAvatarImage {
    size?: string;
    file: string;
}
export interface VvcAgentAvatar {
    base_url: string;
    images: Array<VvcAvatarImage>;
}
export interface VvcAgent {
    id: string;
    nick: string;
    avatar?: VvcAgentAvatar;
}
export interface VvcMediaOffer {
    diff: Object;
    offer: VvcOffer;
}
export interface VvcOffer {
    Chat?: VvcMediaOfferDetails;
    Voice?: VvcMediaOfferDetails;
    Video?: VvcMediaOfferDetails;
    Screen?: VvcMediaOfferDetails;
    Sharing?: VvcMediaOfferDetails;
}
export interface VvcMessage {
    // dataCollection?: DataCollection;
    from_id?: string;
    from_nick?: string;
    id?: number;
    isAgent?: boolean;
    media?: string;
    meta?: Object;
    oPos?: number;
    state?: string;
    text?: string;
    type?: string;
    url?: string;
}
export interface VvcMediaOfferDetails {
    tx: VvcTxRxTypes;
    rx: VvcTxRxTypes;
    via?: string;
    engine?: string;
}
export interface VvcWidgetState {
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
    state: WidgetState;
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
export interface AppState {
    widgetState: VvcWidgetState;
    messages: Array<any>;
    vvcDataCollection: VvcDataCollection;
}

// DATA COLLECTIONS
export interface DataCollection {
    status: string;
    type: string;
}
export interface VvcDataCollection {
    [id: string]: DataCollection;
}
/*
export type DcObjectType = 'text' | 'checkbox' | 'date' | 'email' | 'link' | 'phone' | 'nickname' | 'survey' | 'privacy';
export type DcStates = 'hidden' | 'visible';
export interface DataCollectionState {
    state: DcStates;
    dataCollection?: DataCollection;
}
export interface DataCollection {
    key: string;
    type: string;
    inline?: boolean;
    name: string;
    desc: string;
    data: Array<DcObject>;
}
export interface DcObject {
    key: string;
    controlType: string;
    name: string;
    desc: string;
    type: DcObjectType;
    value?: any;
    checked?: boolean;
    policy?: Object;
    visible?: boolean;
    editable?: boolean;
    config?: DcConfigObject;
}
export interface DcConfigObject {
    hide_from_visitor?: boolean;
    multiline?: boolean;
    required?: boolean;
    default_value?: any;
    max?: number;
    min?: number;
    customRegex?: string;
    values?: Array<DcOptValue>;
}
export interface DcOptValue {
    value: any;
    text: string;
    color?: string;
}
*/
