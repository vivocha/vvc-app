import { MessagesState } from '../models.interface';
import * as fromMessages from '../actions/messages.actions';

const initialState: MessagesState = {
  list: []
};

export function reducer(state: MessagesState = initialState, action: fromMessages.MessagesActions){
  switch (action.type){
    case fromMessages.UPDATE_MESSAGE: {
      const newArray = [];
      const iMessages = state.list.filter( m => m.id === action.payload.id);
      iMessages[0].state = action.payload.state;
      state.list.forEach( (m, i) => {
        if (i === iMessages[0].oPos) {
          newArray.push(iMessages[0]);
        }
        if (m.id !== action.payload.id) {
          newArray.push(m);
        }
      });
      return Object.assign({}, state, { list : [...newArray] });
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