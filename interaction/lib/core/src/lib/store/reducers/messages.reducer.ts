import { MessagesState } from '../models.interface';
import * as fromMessages from '../actions/messages.actions';

const initialState: MessagesState = {
  list: []
};

export function reducer(state: MessagesState = initialState, action: fromMessages.MessagesActions) {
  switch (action.type) {
    case fromMessages.UPDATE_MESSAGE: {
      const newMessages = state.list.map( el => {
        const skipAckCheck = (action.payload.patch.ackIsLate1 || action.payload.patch.ackIsLate2) && el['ack'];
        if (el.id === action.payload.id && !skipAckCheck) {
          if (action.payload.patch.read && !el['ack']){
            action.payload.patch.ack = action.payload.patch.read;
          }
          return Object.assign({}, el, action.payload.patch);
        }
        return el;
      });
      return Object.assign({}, state, { list: [...newMessages]});
    }
    case fromMessages.NEW_MESSAGE: {
      return Object.assign({}, state, { list : [...state.list, action.payload] });
    }
    case fromMessages.REM_MESSAGE: {
      return Object.assign({}, state, { list: state.list.filter( m => m.id !== action.payload) });
    }
    default: return state;
  }
}

export const getMessageRedux = (state: MessagesState): MessagesState => {
  const sorted = state.list.slice().sort((a,b) => {
    return new Date(a.ts).getTime() - new Date(b.ts).getTime();
  });
  const messages = sorted.map( (elem, idx) => {
    let isLast = false;
    let isFirst = false;
    const nextElem = sorted[idx + 1];
    const prevElem = sorted[idx - 1];
    if (prevElem) {
      if (
        elem.type !== prevElem.type ||
        elem.isAgent !== prevElem.isAgent ||
        (elem.agent && prevElem.agent && elem.agent.id !== prevElem.agent.id)
      ) {
        isFirst = true;
      } else {
        isFirst = false;
      }
    } else {
      isFirst = true;
    }
    if (nextElem) {
      if (
        elem['failed'] ||
        elem['ackIsLate1'] ||
        elem['ackIsLate2'] ||
        elem.type !== nextElem.type ||
        elem.isAgent !== nextElem.isAgent ||
        (prevElem && elem.agent && prevElem.agent && elem.agent.id !== prevElem.agent.id )
      ) {
        isLast = true;
      } else {
        isLast = false;
      }
    } else {
      isLast = true;
    }
    return Object.assign({}, elem, { isLast: isLast, isFirst: isFirst });
  });
  return {
    list: [...messages]
  };
};
