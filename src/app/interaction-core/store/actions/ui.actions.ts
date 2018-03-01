import { Action } from '@ngrx/store'

export const WIDGET_LOADED = '[Widget] Loading';
export const WIDGET_RESUME = '[Widget] Resume';
export const WIDGET_INIT_DC = '[Widget] Init Data Collections';
export const WIDGET_SHOW_DC = '[Widget] Show Data Collection';
export const WIDGET_DC_FILLED = '[Widget] Data Collection Filled';
export const WIDGET_CAPS_LOADED = '[Widget] Capabilities Loaded';
export const WIDGET_JOINED = '[Widget] Joined';
export const WIDGET_MEDIA_CHANGE = '[Widget] Media Change';
export const WIDGET_MEDIA_OFFER = '[Widget] Media Offer';

export class WidgetLoaded implements Action {
  readonly type = WIDGET_LOADED;
}
export class WidgetResume implements Action {
  readonly type = WIDGET_RESUME;
}
export class InitializeDataCollections implements Action {
  readonly type = WIDGET_INIT_DC;
  constructor(public payload: any){}
}
export class WidgetShowDc implements Action {
  readonly type = WIDGET_SHOW_DC;
  constructor(public payload: any){}
}
export class WidgetDataCollectionFilled implements Action {
  readonly  type = WIDGET_DC_FILLED;
  constructor(public payload: any){}
}
export class WidgetCapabilityLoaded implements Action {
  readonly type = WIDGET_CAPS_LOADED;
  constructor(public payload: any){}
}
export class WidgetJoined implements Action {
  readonly type = WIDGET_JOINED;
  constructor(public payload: any){}
}
export class WidgetMediaChange implements Action {
  readonly type = WIDGET_MEDIA_CHANGE;
  constructor(public payload: any){}
}
export class WidgetMediaOffer implements Action {
  readonly type = WIDGET_MEDIA_OFFER;
  constructor(public payload: any){}
}

export type UiActions
  = WidgetLoaded
  | WidgetResume
  | WidgetShowDc
  | InitializeDataCollections
  | WidgetDataCollectionFilled
  | WidgetCapabilityLoaded
  | WidgetJoined
  | WidgetMediaChange
  | WidgetMediaOffer;
