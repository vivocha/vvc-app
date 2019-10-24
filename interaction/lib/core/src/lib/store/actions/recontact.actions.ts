import { Action } from '@ngrx/store';

export const RECONTACT_COMPLETED = '[Recontact] Completed';
export const RECONTACT_SELECTED = '[Recontact] Selected';


export class RecontactCompleted implements Action {
  readonly type = RECONTACT_COMPLETED;
  constructor(public payload: any){}
}

export class RecontactSelected implements Action {
  readonly type = RECONTACT_SELECTED;
  constructor(public payload: any){}
}

export type RecontactActions = RecontactCompleted | RecontactSelected;
