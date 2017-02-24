export type VvcTxRxTypes = 'required' | 'optional' | 'off';
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
export interface VvcMediaOfferDetails {
    tx: VvcTxRxTypes;
    rx: VvcTxRxTypes;
    via?: string;
    engine?: string;
}
export interface VvcWidgetState {
    changeMediaState?: boolean;
    chat: boolean;
    error: boolean;
    fullScreen: boolean;
    incomingRequest?: boolean;
    incomingOffer?: VvcOffer;
    lastError: string;
    loading: boolean;
    mobile: boolean;
    mute: boolean;
    sharing: boolean;
    voice: boolean;
    voice_rx?: string;
    voice_tx?: string;
    video: boolean;
    video_rx?: string;
    video_tx?: string;
}
export interface AppState {
    widgetState: VvcWidgetState;
    messages: Array<any>;
}
