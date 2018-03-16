import { EventState } from '../models.interface';
import * as fromEvent from '../actions/event.actions';

export function reducer(state: EventState = { name: 'INIT'}, action: fromEvent.EventActions){
  switch (action.type){
    case fromEvent.EVENT_EMIT: {
      return Object.assign({}, state, action.payload);
    }
    default: return state;
  }
}

export const getLastEvent = (state: EventState) => state;