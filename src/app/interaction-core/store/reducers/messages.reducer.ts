import { MessagesState } from '../models.interface';
import * as fromMessages from '../actions/messages.actions';

const initialState: MessagesState = {
  list: []
};

export function reducer(state: MessagesState = initialState, action: fromMessages.MessagesActions){
  switch (action.type){
    case fromMessages.UPDATE_MESSAGE: {
      const newMessages = state.list.map( el => {
        if (el.id === action.payload.id){
          const o = Object.assign({}, el, action.payload.patch);
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

export const getMessageRedux = (state: MessagesState):MessagesState => {
  const messages = state.list.map( (elem, idx) => {
    let isLast = false;
    let isFirst = false;
    const nextElem = state.list[idx+1];
    const prevElem = state.list[idx-1];
    if (prevElem){
      if (
        elem.type !== prevElem.type ||
        elem.isAgent != prevElem.isAgent ||
        (elem.agent && prevElem.agent && elem.agent.id != prevElem.agent.id)
      ) isFirst = true;
      else isFirst = false;
    }
    else isFirst = true;
    if (nextElem){
      if (
        elem.type !== nextElem.type ||
        elem.isAgent != nextElem.isAgent ||
        (elem.agent && prevElem.agent && elem.agent.id != prevElem.agent.id )
      ) isLast = true;
      else isLast = false;
    }
    else isLast = true;
    let obj = Object.assign({}, elem, { isLast: isLast, isFirst: isFirst });
    return obj;
  });
  return {
    list: [...messages]
  }
}