import {Action} from '@ngrx/store';
import {ProtocolState, AgentState, TopBarState, CbnStatus, InboundStatus} from '../models.interface';

export const WIDGET_CLOSED_BY_AGENT       = '[Widget] Closed by Agent';
export const WIDGET_CLOSED_BY_VISITOR     = '[Widget] Closed by Visitor';
export const WIDGET_CONTACT_FAILED        = '[Widget] Contact Failed';
export const WIDGET_HIDE_QUEUE_FOR_CHAT   = '[Widget] Hide Queue For Chat';
export const WIDGET_INCOMING_MEDIA        = '[Widget] Incoming Media';
export const WIDGET_INIT_CHAT             = '[Widget] Init Chat';
export const WIDGET_INIT_CONTEXT          = '[Widget] Init Context';
export const WIDGET_INIT_MULTIMEDIA       = '[Widget] Init Multimedia';
export const WIDGET_INIT_PROTOCOL         = '[Widget] Init Protocol';
export const WIDGET_IS_OFFERING           = '[Widget] Is Offering';
export const WIDGET_IS_UPLOADING          = '[Widget] Is Uploading';
export const WIDGET_IS_WRITING            = '[Widget] Is Writing';
export const WIDGET_IN_VIDEO_TRANSIT      = '[Widget] In Video Transit';
export const WIDGET_MARK_AS_READ          = '[Widget] Mark as read';
export const WIDGET_MEDIA_CHANGE          = '[Widget] Media Change';
export const WIDGET_MEDIA_OFFER           = '[Widget] Media Offer';
export const WIDGET_MUTE_IN_PROGRESS      = '[Widget] Mute in progress';
export const WIDGET_MUTE_SUCCESS          = '[Widget] Mute Success';
export const WIDGET_NEW_MESSAGE           = '[Widget] New Message';
export const WIDGET_OFFER_ACCEPTED        = '[Widget] Offer Accepted';
export const WIDGET_OFFER_REJECTED        = '[Widget] Offer Rejected';
export const WIDGET_SET_AGENT             = '[Widget] Set Agent';
export const WIDGET_SET_AUTO_CHAT         = '[Widget] Set Auto Chat';
export const WIDGET_SET_CBN_MODE          = '[Widget] Set Cbn Mode';
export const WIDGET_SET_CBN_STATE         = '[Widget] Set Cbn State';
export const WIDGET_SET_INBOUND_MODE      = '[Widget] Set Inbound Mode';
export const WIDGET_SET_INBOUND_STATE     = '[Widget] Set Inbound State';
export const WIDGET_SET_DIALOG_UI         = '[Widget] Set Dialog UI';
export const WIDGET_SET_ERROR             = '[Widget] Set Error';
export const WIDGET_SET_FULLSCREEN        = '[Widget] Set Fullscreen';
export const WIDGET_SET_MINIMIZED         = '[Widget] Set Minimized';
export const WIDGET_SET_MINIMIZED_MEDIA   = '[Widget] Set Minimized Media';
export const WIDGET_SET_NORMAL            = '[Widget] Set Normal';
export const WIDGET_SET_TOP_BAR           = '[Widget] Set Top Bar';
export const WIDGET_SHOW_CHAT_FULLSCREEN  = '[Widget] Fullscreen Chat';
export const WIDGET_SHOW_CLOSE_PANEL      = '[Widget] Show Close Panel';
export const WIDGET_SHOW_QUEUE_PANEL      = '[Widget] Show Queue Panel';
export const WIDGET_SHOW_UPLOAD_PANEL     = '[Widget] Show Upload Panel';
export const WIDGET_TOGGLE_EMOJI          = '[Widget] Toggle Emoji Panel';
export const WIDGET_UI_READY              = '[Widget] Ui Ready';
export const WIDGET_UPDATE_REMOTE_CAPS    = '[Widget] Update Remote Capabilities';
export const WIDGET_UPDATE_LOCAL_CAPS     = '[Widget] Update Local Capabilities';
export const WIDGET_UPLOAD_COMPLETED      = '[Widget] Upload Completed';
export const WIDGET_UPGRADE_CBN_TO_CHAT   = '[Widget] Upgrade Cbn to Chat';
export const WIDGET_WEBLEAD_SENT          = '[Widget] Weblead Sent';


export class WidgetClosedByAgent implements Action {
  readonly type = WIDGET_CLOSED_BY_AGENT;
}
export class WidgetClosedByVisitor implements Action {
  readonly type = WIDGET_CLOSED_BY_VISITOR;
}
export class WidgetContactCreationFailed implements Action {
  readonly type = WIDGET_CONTACT_FAILED;
}
export class WidgetHideQueueForChat implements Action {
  readonly type = WIDGET_HIDE_QUEUE_FOR_CHAT;
}
export class WidgetIncomingMedia implements Action {
  readonly type = WIDGET_INCOMING_MEDIA;
  constructor(public payload: any) {}
}
export class WidgetInitChat implements Action {
  readonly type = WIDGET_INIT_CHAT;
  constructor(public payload: any) {}
}
export class WidgetInitContext implements Action {
  readonly type = WIDGET_INIT_CONTEXT;
  constructor(public payload: any) {}
}
export class WidgetInitializeMultimedia implements Action {
  readonly type = WIDGET_INIT_MULTIMEDIA;
  constructor(public payload: any) {}
}
export class WidgetInitProtocol implements Action {
  readonly type = WIDGET_INIT_PROTOCOL;
  constructor(public payload: ProtocolState) {}
}
export class WidgetIsOffering implements Action {
  readonly type = WIDGET_IS_OFFERING;
  constructor(public payload: string) {}
}
export class WidgetIsUploading implements Action {
  readonly type = WIDGET_IS_UPLOADING;
}
export class WidgetIsWriting implements Action {
  readonly type = WIDGET_IS_WRITING;
  constructor(public payload: boolean) {}
}
export class WidgetSetVideoTransit implements Action {
  readonly type = WIDGET_IN_VIDEO_TRANSIT;
  constructor(public payload: boolean) {}
}
export class WidgetMarkAsRead implements Action {
  readonly type = WIDGET_MARK_AS_READ;
}
export class WidgetMediaChange implements Action {
  readonly type = WIDGET_MEDIA_CHANGE;
  constructor(public payload: any) {}
}
export class WidgetMediaOffer implements Action {
  readonly type = WIDGET_MEDIA_OFFER;
  constructor(public payload: any) {}
}
export class WidgetMuteInProgress implements Action {
  readonly type = WIDGET_MUTE_IN_PROGRESS;
}
export class WidgetMuteSuccess implements Action {
  readonly type = WIDGET_MUTE_SUCCESS;
  constructor(public payload: boolean) {}
}
export class WidgetNewMessage implements Action {
  readonly type = WIDGET_NEW_MESSAGE;
}
export class WidgetOfferAccepted implements Action {
  readonly type = WIDGET_OFFER_ACCEPTED;
}
export class WidgetOfferRejected implements Action {
  readonly type = WIDGET_OFFER_REJECTED;
}
export class WidgetSetAgent implements Action {
  readonly type = WIDGET_SET_AGENT;
  constructor(public payload: AgentState) {}
}
export class WidgetSetAutoChat implements Action {
  readonly type = WIDGET_SET_AUTO_CHAT;
}
export class WidgetSetCbnMode implements Action {
  readonly type = WIDGET_SET_CBN_MODE;
  constructor(public payload: boolean) {}
}
export class WidgetSetInboundMode implements Action {
  readonly type = WIDGET_SET_INBOUND_MODE;
  constructor(public payload: InboundStatus) {}
}
export class WidgetSetInboundState implements Action {
  readonly type = WIDGET_SET_INBOUND_STATE;
  constructor(public payload: string) {}
}
export class WidgetSetCbnState implements Action {
  readonly type = WIDGET_SET_CBN_STATE;
  constructor(public payload: CbnStatus) {}
}
export class WidgetSetDialogUi implements Action {
  readonly type = WIDGET_SET_DIALOG_UI;
}
export class WidgetSetError implements Action {
  readonly type = WIDGET_SET_ERROR;
}
export class WidgetSetFullScreen implements Action {
  readonly type = WIDGET_SET_FULLSCREEN;
}
export class WidgetSetMinimized implements Action {
  readonly type = WIDGET_SET_MINIMIZED;
}
export class WidgetSetMinimizedMedia implements Action {
  readonly type = WIDGET_SET_MINIMIZED_MEDIA;
  constructor(public payload: boolean) {}
}
export class WidgetSetNormal implements Action {
  readonly type = WIDGET_SET_NORMAL;
}
export class WidgetSetTopBar implements Action {
  readonly type = WIDGET_SET_TOP_BAR;
  constructor(public payload: TopBarState) {}
}
export class WidgetShowChatOnFullScreen implements Action {
  readonly type = WIDGET_SHOW_CHAT_FULLSCREEN;
  constructor(public payload: boolean) {}
}
export class WidgetShowClosePanel implements Action {
  readonly type = WIDGET_SHOW_CLOSE_PANEL;
  constructor(public payload: boolean) {}
}
export class WidgetShowQueuePanel implements Action {
  readonly type = WIDGET_SHOW_QUEUE_PANEL;
}
export class WidgetShowUploadPanel implements Action {
  readonly type = WIDGET_SHOW_UPLOAD_PANEL;
  constructor(public payload: boolean) {}
}
export class WidgetToggleEmoji implements Action {
  readonly type = WIDGET_TOGGLE_EMOJI;
}
export class WidgetUploadCompleted implements Action {
  readonly type = WIDGET_UPLOAD_COMPLETED;
}
export class WidgetUiReady implements Action {
  readonly type = WIDGET_UI_READY;
}
export class WidgetUpdateRemoteCaps implements Action {
  readonly type = WIDGET_UPDATE_REMOTE_CAPS;
  constructor(public payload: any) {}
}
export class WidgetUpdateLocalCaps implements Action {
  readonly type = WIDGET_UPDATE_LOCAL_CAPS;
  constructor(public payload: any) {}
}
export class WidgetUpgradeCbnToChat implements Action {
  readonly type = WIDGET_UPGRADE_CBN_TO_CHAT;
}
export class WidgetWebleadSent implements Action {
  readonly type = WIDGET_WEBLEAD_SENT;
}
export type WidgetActions
  = WidgetClosedByAgent
  | WidgetClosedByVisitor
  | WidgetContactCreationFailed
  | WidgetHideQueueForChat
  | WidgetIncomingMedia
  | WidgetInitChat
  | WidgetInitContext
  | WidgetInitializeMultimedia
  | WidgetInitProtocol
  | WidgetIsOffering
  | WidgetIsUploading
  | WidgetIsWriting
  | WidgetSetVideoTransit
  | WidgetMarkAsRead
  | WidgetMediaChange
  | WidgetMediaOffer
  | WidgetMuteInProgress
  | WidgetMuteSuccess
  | WidgetNewMessage
  | WidgetOfferAccepted
  | WidgetOfferRejected
  | WidgetSetAgent
  | WidgetSetAutoChat
  | WidgetSetCbnMode
  | WidgetSetCbnState
  | WidgetSetInboundMode
  | WidgetSetInboundState
  | WidgetSetDialogUi
  | WidgetSetError
  | WidgetSetFullScreen
  | WidgetSetMinimized
  | WidgetSetMinimizedMedia
  | WidgetSetNormal
  | WidgetSetTopBar
  | WidgetShowChatOnFullScreen
  | WidgetShowClosePanel
  | WidgetShowQueuePanel
  | WidgetShowUploadPanel
  | WidgetToggleEmoji
  | WidgetUpdateLocalCaps
  | WidgetUpdateRemoteCaps
  | WidgetUploadCompleted
  | WidgetUiReady
  | WidgetUpgradeCbnToChat
  | WidgetWebleadSent
  ;
