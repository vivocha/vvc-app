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
          console.log('UPDATED', o);
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

export const getMessages = (state: MessagesState) => state.list;