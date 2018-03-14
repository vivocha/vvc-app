import {Action} from '@ngrx/store';
export const WIDGET_REMOTE_CAPS = '[Widget] Remote Caps';
export const WIDGET_LOCAL_CAPS = '[Widget] Local Caps';
export const WIDGET_MEDIA_CHANGE = '[Widget] Media Change';
export const WIDGET_MEDIA_OFFERING = '[Widget] Media Offering';
export const WIDGET_JOINED = '[Widget] Joined';
export const WIDGET_QUEUE = '[Widget] Queue';


export class WidgetRemoteCaps implements Action {
  readonly type = WIDGET_REMOTE_CAPS;
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
export class WidgetJoined implements Action {
  readonly type = WIDGET_JOINED;
  constructor(public payload: any){}
}
export class WidgetQueue implements Action {
  readonly type = WIDGET_QUEUE;
  constructor(public payload: any){}
}

export type WidgetActions
  = WidgetRemoteCaps
  | WidgetLocalCaps
  | WidgetMediaChange
  | WidgetMediaOffering
  | WidgetJoined
  | WidgetQueue;

