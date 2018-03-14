import * as fromWidget from '../actions/widget.actions';
import {WidgetState} from '../models.interface';


export function reducer(state: WidgetState = {}, action: fromWidget.WidgetActions){
  switch (action.type){
    case fromWidget.WIDGET_JOINED: {
      return Object.assign({}, state, { agent: action.payload });
    }
    case fromWidget.WIDGET_LOCAL_CAPS: {
      return Object.assign({}, state, { localCaps: action.payload });
    }
    case fromWidget.WIDGET_REMOTE_CAPS: {
      return Object.assign({}, state, { remoteCaps: action.payload });
    }
    case fromWidget.WIDGET_QUEUE: {
      return Object.assign({}, state, { queue: action.payload });
    }
    default: return state;
  }
}