import {Action} from '@ngrx/store';
import {DataCollection} from '@vivocha/public-entities/dist';
import {DataCollectionCompleted} from '../models.interface';

export const DC_INITIALIZED  = '[Data Collection] Initialized';
export const DC_ADDED        = '[Data Collection] Added Definition';
export const DC_SELECTED     = '[Data Collection] Selected';
export const DC_END          = '[Data Collection] Completed';
export const DC_RESOLVED     = '[Data Collection] Resolved';
export const DC_SHOW_PANEL   = '[Data Collection] Show Panel';


export class DataCollectionInitialized implements Action {
  readonly type = DC_INITIALIZED;
  constructor(public payload: { dataCollectionIds?: string[], surveyId?: string}) {}
}
export class DataCollectionAdded implements Action {
  readonly type = DC_ADDED;
  constructor(public payload: DataCollection) {}
}

export class DataCollectionEnd implements Action {
  readonly type = DC_END;
  constructor(public payload: DataCollectionCompleted) {}
}
export class DataCollectionSelected implements Action {
  readonly type = DC_SELECTED;
  constructor(public payload: { dc: DataCollection, type: string }) {}
}
export class DataCollectionResolved implements Action {
  readonly type = DC_RESOLVED;
}
export class DataCollectionShowPanel implements Action {
  readonly type = DC_SHOW_PANEL;
  constructor(public payload: boolean) {}
}

export type DataCollectionActions
  = DataCollectionInitialized
  | DataCollectionAdded
  | DataCollectionEnd
  | DataCollectionSelected
  | DataCollectionResolved
  | DataCollectionShowPanel;
