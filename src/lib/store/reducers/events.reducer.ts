import {EventsState} from '../models.interface';
import * as fromEvents from '../actions/events.actions';

export function reducer(state: EventsState, action: fromEvents.EventsActions) {
  switch (action.type) {
    case fromEvents.NEW_EVENT: {
      return Object.assign({}, state, action.payload);
    }
    default: return state;
  }
}
