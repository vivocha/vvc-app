import {Action} from '@ngrx/store';

export const INITIAL_DATA = '[Widget] Initial Data';
export const ADD_DATA_COLLECTION = '[Widget] Add Data Collection';
export const MERGE_DATA_COLLECTION = '[Widget] Merge Data Collection';
export const INITIAL_DATA_SENT = '[Widget] Initial Data Sent';
export const INITIAL_OFFER = '[Widget] Initial Offer';
export const REMOTE_CAPS = '[Widget] Remote Caps';
export const LOCAL_CAPS = '[Widget] Local Caps';
export const MEDIA_CHANGE = '[Widget] Media Change';
export const MEDIA_OFFERING = '[Widget] Media Offering';
export const JOINED = '[Widget] Joined';
export const FULLSCREEN = '[Widget] Fullscreen';
export const MUTE = '[Widget] Mute';
export const MUTE_IN_PROGRESS = '[Widget] Mute In Progress';
export const CHATVISIBILITY = '[Widget] Chat Visibility';
export const REDUCE_TOPBAR = '[Widget] Reduce Topbar';
export const SHOW_DATA_COLLECTION = '[Widget] Show Data Collection';
export const SHOW_SURVEY = '[Widget] Show Survey';
export const AGENT_IS_WRITING = '[Widget] Agent is Writing';
export const CLOSE_CONTACT = '[Widget] Close Contact';
export const MINIMIZE = '[Widget] Minimize';
export const INCREMENT_NOT_READ = '[Widget] Increment Not Read';
export const RESET_NOT_READ = '[Widget] Reset Not Read';


export class InitialData implements Action {
  readonly type = INITIAL_DATA;
  constructor(public payload: any){}
}
export class AddDataCollection implements Action {
  readonly type = ADD_DATA_COLLECTION;
  constructor(public payload: any){}
}
export class MergeDataCollection implements Action {
  readonly type = MERGE_DATA_COLLECTION;
  constructor(public payload: any){}
}
export class InitialDataSent implements Action {
  readonly type = INITIAL_DATA_SENT;
  constructor(public payload: any){}
}
export class InitialOffer implements Action {
  readonly type = INITIAL_OFFER;
  constructor(public payload: any){}
}
export class RemoteCaps implements Action {
  readonly type = REMOTE_CAPS;
  constructor(public payload: any){}
}
export class LocalCaps implements Action {
  readonly type = LOCAL_CAPS;
  constructor(public payload: any){}
}
export class MediaChange implements Action {
  readonly type = MEDIA_CHANGE;
  constructor(public payload: any){}
}
export class MediaOffering implements Action {
  readonly type = MEDIA_OFFERING;
  constructor(public payload: any){}
}
export class Joined implements Action {
  readonly type = JOINED;
  constructor(public payload: any){}
}
export class Fullscreen implements Action {
  readonly type = FULLSCREEN;
  constructor(public payload: any){}
}
export class Mute implements Action {
  readonly type = MUTE;
  constructor(public payload: any){}
}
export class MuteInProgress implements Action {
  readonly type = MUTE_IN_PROGRESS;
  constructor(public payload: any){}
}
export class ChatVisibility implements Action {
  readonly type = CHATVISIBILITY;
  constructor(public payload: any){}
}
export class ReduceTopbar implements Action {
  readonly type = REDUCE_TOPBAR;
}
export class ShowDataCollection implements Action {
  readonly type = SHOW_DATA_COLLECTION;
  constructor(public payload: any){}
}
export class ShowSurvey implements Action {
  readonly type = SHOW_SURVEY;
  constructor(public payload: any){}
}
export class AgentIsWriting implements Action {
  readonly type = AGENT_IS_WRITING;
  constructor(public payload: any){}
}
export class CloseContact implements Action {
  readonly type = CLOSE_CONTACT;
  constructor(public payload: any){}
}
export class Minimize implements Action {
  readonly type = MINIMIZE;
  constructor(public payload: any){}
}
export class IncrementNotRead implements Action {
  readonly type = INCREMENT_NOT_READ;
}
export class ResetNotRead implements Action {
  readonly type = RESET_NOT_READ;
}

export type WidgetActions
  = InitialData
  | AddDataCollection
  | MergeDataCollection
  | InitialDataSent
  | InitialOffer
  | RemoteCaps
  | LocalCaps
  | MediaChange
  | MediaOffering
  | Joined
  | Fullscreen
  | Mute
  | MuteInProgress
  | ChatVisibility
  | ReduceTopbar
  | ShowDataCollection
  | ShowSurvey
  | AgentIsWriting
  | CloseContact
  | Minimize
  | IncrementNotRead
  | ResetNotRead;