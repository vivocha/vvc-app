import {Action} from '@ngrx/store';

export const LOAD_CONTEXT_SUCCESS = '[Context] Load Success';

export class LoadContextSuccess implements Action {
  readonly type = LOAD_CONTEXT_SUCCESS;
  constructor(public payload: any){}
}

export type ContextActions = LoadContextSuccess;