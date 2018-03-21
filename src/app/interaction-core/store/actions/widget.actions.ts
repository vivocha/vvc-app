import {Action} from '@ngrx/store';
import {TopBarState, WidgetState} from '../models.interface';

export const WIDGET_NEW_STATE = '[Widget] New State';

export const WIDGET_CLOSED_BY_AGENT = '[Widget] Closed By Agent';
export const WIDGET_CLOSED_BY_VISITOR = '[Widget] Closed By Visitor';
export const WIDGET_IS_WRITING = '[Widget] Is Writing';
export const WIDGET_JOINED = '[Widget] Joined';
export const WIDGET_LOCAL_CAPS = '[Widget] Local Caps';
export const WIDGET_MEDIA_CHANGE = '[Widget] Media Change';
export const WIDGET_MEDIA_OFFERING = '[Widget] Media Offering';
export const WIDGET_MINIMIZE = '[Widget] Minimize';
export const WIDGET_NEW_MESSAGE = '[Widget] New Message';
export const WIDGET_QUEUE = '[Widget] Queue';
export const WIDGET_REMOTE_CAPS = '[Widget] Remote Caps';
export const WIDGET_RESET_UNREAD = '[Widget] Reset Unread';
export const WIDGET_SHOW_CLOSE_MODAL = '[Widget] Show Close Modal';
export const WIDGET_TOGGLE_EMOJI = '[Widget] Toggle Emoji Panel';
export const WIDGET_TOP_BAR = '[Widget] Top Bar';

export class WidgetNewState implements Action {
  readonly type = WIDGET_NEW_STATE;
  constructor(public payload: WidgetState){}
}

export class WidgetClosedByAgent implements Action {
  readonly type = WIDGET_CLOSED_BY_AGENT;
}
export class WidgetClosedByVisitor implements Action {
  readonly type = WIDGET_CLOSED_BY_VISITOR;
}
export class WidgetIsWriting implements Action {
  readonly type = WIDGET_IS_WRITING;
  constructor(public payload: boolean){}
}
export class WidgetJoined implements Action {
  readonly type = WIDGET_JOINED;
  constructor(public payload: any){}
}
export class WidgetLocalCaps implements Action {
  readonly type = WIDGET_LOCAL_CAPS;
  constructor(public payload: any){}
}
export class WidgetMediaChange implements Action {
  readonly type = WIDGET_MEDIA_CHANGE;
  constructor(public payload: any){}
}
export class WidgetMediaOffering implements Action {
  readonly type = WIDGET_MEDIA_OFFERING;
  constructor(public payload: any){}
}
export class WidgetMinimize implements Action {
  readonly type = WIDGET_MINIMIZE;
  constructor(public payload: boolean){}
}
export class WidgetNewMessage implements Action {
  readonly type = WIDGET_NEW_MESSAGE;
}
export class WidgetQueue implements Action {
  readonly type = WIDGET_QUEUE;
}
export class WidgetRemoteCaps implements Action {
  readonly type = WIDGET_REMOTE_CAPS;
  constructor(public payload: any){}
}
export class WidgetResetUnread implements Action {
  readonly type = WIDGET_RESET_UNREAD;
}
export class WidgetShowCloseModal implements Action {
  readonly type = WIDGET_SHOW_CLOSE_MODAL;
  constructor(public payload: boolean){}
}
export class WidgetToggleEmoji implements Action {
  readonly type = WIDGET_TOGGLE_EMOJI;

}
export class WidgetTopBar implements Action {
  readonly type = WIDGET_TOP_BAR;
  constructor(public payload: TopBarState){}
}

export type WidgetActions
  = WidgetClosedByAgent
  | WidgetClosedByVisitor
  | WidgetIsWriting
  | WidgetJoined
  | WidgetLocalCaps
  | WidgetMediaChange
  | WidgetMediaOffering
  | WidgetMinimize
  | WidgetNewMessage
  | WidgetQueue
  | WidgetRemoteCaps
  | WidgetResetUnread
  | WidgetShowCloseModal
  | WidgetToggleEmoji
  | WidgetTopBar
  | WidgetNewState
  ;
