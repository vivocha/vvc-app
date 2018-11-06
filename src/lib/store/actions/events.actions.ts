import {Action} from '@ngrx/store';
import {EventsState} from '../models.interface';

export const NEW_EVENT = '[Events] New Event';

export class NewEvent implements Action {
  readonly type = NEW_EVENT;
  constructor(public payload: EventsState) {}
}
export type EventsActions = NewEvent;
