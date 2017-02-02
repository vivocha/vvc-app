export type UiState = 'LOADING' | 'SHARING' | 'CHAT' | 'VIDEO' | 'VOICE';
export type SmartState = 'HIDDEN' | 'LOADING' | 'CONNECTED' | 'ERROR';
export type SmartType = 'VOICE' | 'VIDEO';
export type SmartError = 'REJECTED' | 'FAILED';
export type MsgStatus = 'DELIVERING' | 'DELIVERED' | 'ERROR';
export type MediaInfoType = 'VOICE' | 'VIDEO';
export type ChatMsgType = 'AGENT' | 'AGENT-INFO' | 'AGENT-WRITING' | 'AGENT-ATTACHMENT' | 'CUSTOMER' | 'CUSTOMER-ATTACHMENT' | 'MEDIA-INFO';
export type ChatMsg = InfoAgentMsg | AgentMsg | AgentWritingMsg | AgentAttachmentMsg | CustomerMsg | CustomerAttachmentMsg | MediaInfoMsg;

export interface AppState {
    widgetState: WidgetState;
    mediaState: VvcMediaState;
    mediaOffer: VvcMediaOffer;
    agent: VvcAgent;
    dataCollections: Object;
}
export interface WidgetState {
    state: WidgetStateTypes;
    error?: SmartError;
}
export type WidgetStateTypes = 'LOADING' | 'READY' | 'IREQUEST' | 'OREQUEST' | 'CLOSING' | 'CLOSED';

export interface VvcMediaState {
    Sharing: VvcMediaStateDetails;
    Chat?: VvcMediaStateDetails;
    Voice?: VvcMediaStateDetails;
    Video?: VvcMediaStateDetails;
    Screen?: VvcMediaStateDetails;
}

export interface VvcMediaStateDetails {
    tx: boolean;
    rx: boolean;
    via?: string;
    engine?: string;
    data?: {
        tx_stream?: { url?: string};
        rx_stream?: { url?: string};
    };
}

export interface VvcMediaOffer {
    diff: Object;
    offer: {
        Chat?: VvcMediaOfferDetails;
        Voice?: VvcMediaOfferDetails;
        Video?: VvcMediaOfferDetails;
        Screen?: VvcMediaOfferDetails;
    };
}

export interface VvcMediaOfferDetails {
    tx: VvcTxRxTypes;
    rx: VvcTxRxTypes;
    via?: string;
    engine?: string;
}

type VvcTxRxTypes = 'required' | 'optional' | 'off';

export interface SmartBar {
    state: SmartState;
    type?: SmartType;
    error?: SmartError;
}
export interface IncomingRequest {
    show: boolean;
    type: string;
}
export interface BaseMsg {
    ref?: string;
    type: ChatMsgType;
}
export interface InfoAgentMsg extends BaseMsg {
    text: string;
    agent: VvcAgent;
    isError?: boolean;
    isEmph?: boolean;
}
export interface AgentMsg extends BaseMsg {
    text: string;
    from_id: string;
    from_nick?: string;
    agent: VvcAgent;
    status: MsgStatus;
}
export interface AgentAttachmentMsg extends BaseMsg {
    from_id: string;
    from_nick?: string;
    agent: VvcAgent;
    url: string;
    meta: Object;
    status: MsgStatus;
}
export interface AgentWritingMsg extends BaseMsg {
    agent: VvcAgent;
}
export interface CustomerMsg extends BaseMsg {
    text: string;
    from_id: string;
    from_nick?: string;
    status: MsgStatus;
}
export interface CustomerAttachmentMsg extends BaseMsg {
    from_id: string;
    from_nick?: string;
    url: string;
    meta: Object;
    status: MsgStatus;
}
export interface MediaInfoMsg extends BaseMsg {
    info_type: MediaInfoType;
    text?: string;
}
export interface VvcAvatarImage {
    size?: string;
    file: string;
}
export interface VvcAgentAvatar {
    base_url: string;
    images: Array<VvcAvatarImage>;
}
export interface VvcAgent {
    user: string;
    nick: string;
    avatar?: VvcAgentAvatar;
}

// DATA COLLECTIONS
export type DcObjectType = 'text' | 'checkbox' | 'date' | 'email' | 'link' | 'phone' | 'nickname' | 'survey' | 'privacy';
export type DcStates = 'hidden' | 'visible';
export interface DataCollectionState {
    state: DcStates;
    dataCollection?: DataCollection;
}
export interface DataCollection {
    key: string;
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
