import { Action } from '@ngrx/store';

export const DC_LOADED = '[Data Collection] Loaded';
export const DC_COMPLETED = '[Data Collection] Completed';
export const DC_SELECTED = '[Data Collection] Selected';

export class DataCollectionLoaded implements Action {
  readonly type = DC_LOADED;
  constructor(public payload: any){}
}

export class DataCollectionCompleted implements Action {
  readonly type = DC_COMPLETED;
  constructor(public payload: any){}
}

export class DataCollectionSelected implements Action {
  readonly type = DC_SELECTED;
  constructor(public payload: any){}
}

export type DataCollectionActions = DataCollectionLoaded | DataCollectionCompleted | DataCollectionSelected;