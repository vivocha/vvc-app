import {Action} from '@ngrx/store';

export const EVENT_EMIT = '[Event] Emit';

export class VvcEventEmit implements Action {
  readonly type = EVENT_EMIT;
  constructor(public payload: any){}
}

export type EventActions = VvcEventEmit;