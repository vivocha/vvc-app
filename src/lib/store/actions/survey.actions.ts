import { Action } from '@ngrx/store';

export const SURVEY_LOADED = '[Survey] Loaded';
export const SURVEY_COMPLETED = '[Survey] Completed';
export const SURVEY_SELECTED = '[Survey] Selected';

export class SurveyLoaded implements Action {
  readonly type = SURVEY_LOADED;
  constructor(public payload: any){}
}

export class SurveyCompleted implements Action {
  readonly type = SURVEY_COMPLETED;
  constructor(public payload: any){}
}

export class SurveySelected implements Action {
  readonly type = SURVEY_SELECTED;
  constructor(public payload: any){}
}

export type SurveyActions = SurveyLoaded | SurveyCompleted | SurveySelected;