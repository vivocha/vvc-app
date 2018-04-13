import {Action} from '@ngrx/store';
import {ContextState, ProtocolState, AgentState} from '../models.interface';

export const WIDGET_CLOSED_BY_AGENT   = '[Widget] Closed by Agent';
export const WIDGET_CLOSED_BY_VISITOR = '[Widget] Closed by Visitor';
export const WIDGET_INIT_CHAT         = '[Widget] Init Chat';
export const WIDGET_INIT_CONTEXT      = '[Widget] Init Context';
export const WIDGET_INIT_MULTIMEDIA   = '[Widget] Init Multimedia';
export const WIDGET_INIT_PROTOCOL     = '[Widget] Init Protocol';
export const WIDGET_IS_WRITING        = '[Widget] Is Writing';
export const WIDGET_MARK_AS_READ      = '[Widget] Mark as read';
export const WIDGET_NEW_MESSAGE       = '[Widget] New Message';
export const WIDGET_SET_AGENT         = '[Widget] Set Agent';
export const WIDGET_SET_MINIMIZED     = '[Widget] Set Minimized';
export const WIDGET_SET_NORMAL        = '[Widget] Set Normal';
export const WIDGET_SHOW_CLOSE_PANEL  = '[Widget] Show Close Panel';
export const WIDGET_SHOW_UPLOAD_PANEL = '[Widget] Show Upload Panel';
export const WIDGET_TOGGLE_EMOJI      = '[Widget] Toggle Emoji Panel';


export class WidgetClosedByAgent implements Action {
  readonly type = WIDGET_CLOSED_BY_AGENT;
}
export class WidgetClosedByVisitor implements Action {
  readonly type = WIDGET_CLOSED_BY_VISITOR;
}
export class WidgetInitChat implements Action {
  readonly type = WIDGET_INIT_CHAT;
  constructor(public payload: any){}
}
export class WidgetInitContext implements Action {
  readonly type = WIDGET_INIT_CONTEXT;
  constructor(public payload: any){}
}
export class WidgetInitializeMultimedia implements Action {
  readonly type = WIDGET_INIT_MULTIMEDIA;
  constructor(public payload: any){}
}
export class WidgetInitProtocol implements Action {
  readonly type = WIDGET_INIT_PROTOCOL;
  constructor(public payload: ProtocolState){}
}
export class WidgetIsWriting implements Action {
  readonly type = WIDGET_IS_WRITING;
  constructor(public payload: boolean){}
}
export class WidgetMarkAsRead implements Action {
  readonly type = WIDGET_MARK_AS_READ;
}
export class WidgetNewMessage implements Action {
  readonly type = WIDGET_NEW_MESSAGE;
}
export class WidgetSetAgent implements Action {
  readonly type = WIDGET_SET_AGENT;
  constructor(public payload: AgentState){}
}
export class WidgetSetMinimized implements Action {
  readonly type = WIDGET_SET_MINIMIZED;
}
export class WidgetSetNormal implements Action {
  readonly type = WIDGET_SET_NORMAL;
}
export class WidgetShowClosePanel implements Action {
  readonly type = WIDGET_SHOW_CLOSE_PANEL;
  constructor(public payload: boolean){}
}
export class WidgetShowUploadPanel implements Action {
  readonly type = WIDGET_SHOW_UPLOAD_PANEL;
  constructor(public payload: boolean){}
}
export class WidgetToggleEmoji implements Action {
  readonly type = WIDGET_TOGGLE_EMOJI;
}
export type WidgetActions
  = WidgetClosedByAgent
  | WidgetClosedByVisitor
  | WidgetInitChat
  | WidgetInitContext
  | WidgetInitializeMultimedia
  | WidgetInitProtocol
  | WidgetIsWriting
  | WidgetMarkAsRead
  | WidgetNewMessage
  | WidgetSetAgent
  | WidgetSetMinimized
  | WidgetSetNormal
  | WidgetShowClosePanel
  | WidgetShowUploadPanel
  | WidgetToggleEmoji
  ;
