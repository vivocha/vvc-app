import {MessagesState} from '../models.interface';
import * as fromMessages from '../actions/messages.actions';

const initialState: MessagesState = {
  messages: []
};

export function reducer(state: MessagesState = initialState, action: fromMessages.MessagesActions){
  switch (action.type){
    case fromMessages.UPDATE_MESSAGE: {
      const newArray = [];
      const iMessages = state.messages.filter( m => m.id === action.payload.id);
      iMessages[0].state = action.payload.state;
      state.messages.forEach( (m, i) => {
        if (i === iMessages[0].oPos) {
          newArray.push(iMessages[0]);
        }
        if (m.id !== action.payload.id) {
          newArray.push(m);
        }
      });
      return Object.assign({}, state, { messages : [...newArray] });
    }
    case fromMessages.NEW_MESSAGE: {
      const isWritingMessages = state.messages.filter( m => m.state === 'iswriting');
      const incomingMessages = state.messages.filter( m => m.type === 'incoming-request' && m.state !== 'closed');
      let chatMessages = [];
      if (incomingMessages.length > 0) {
        chatMessages = state.messages.filter(m => m.state !== 'open').concat(incomingMessages);
      } else {
        chatMessages = state.messages;
      }
      if (action.payload.type === 'incoming-request') {
        action.payload.oPos = chatMessages.length;
      }
      return Object.assign({}, state, { messages : [...chatMessages
        .filter (m => m.state !== 'iswriting')
        .concat(action.payload, isWritingMessages)]});
    }
    case fromMessages.REM_MESSAGE: {
      return Object.assign({}, state, { messages: state.messages.filter( m => m.id !== action.payload.id) });
    }
    case fromMessages.REM_IS_WRITING: {
      return Object.assign( {}, state, { messages: state.messages.filter( m => m.state !== 'iswriting') });
    }
    default: return state;
  }
}

export const getMessages = (state: MessagesState) => state.messages;