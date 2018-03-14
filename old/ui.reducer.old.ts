import {UiState} from '../models.interface';
import * as fromUi from '../actions/ui.actions';

const initialState = {
  loading: true
};

export function reducer(state: UiState = initialState, action: fromUi.UiActions){
  switch(action.type){
    case fromUi.WIDGET_LOADED: {
      return Object.assign({},state, { loading: false });
    }
    case fromUi.WIDGET_INIT_DC: {
      return Object.assign({}, state, { dataCollections: action.payload, selectedDataCollection: 0, filledDataCollections: [] });
    }
    case fromUi.WIDGET_DC_FILLED: {
      const newFilled = [...state.filledDataCollections, action.payload.dc];
      const nextDc = newFilled.length - 1;
      return Object.assign({}, state, { filledDataCollection: newFilled, selectedDataCollection: nextDc })
    }
    case fromUi.WIDGET_CAPS_LOADED: {
      return Object.assign({}, state, { [action.payload.type]: action.payload.caps });
    }
    case fromUi.WIDGET_MEDIA_OFFER: {
      return Object.assign({}, state, { mediaOffer: action.payload });
    }
    case fromUi.WIDGET_MEDIA_CHANGE: {
      return Object.assign({}, state, { mediaChange: action.payload });
    }
    case fromUi.WIDGET_JOINED: {
      console.log('JOINED REDUCER', action);
      return Object.assign({}, state, { agent: action.payload });
    }
  }
  return state;
}

export const getPushedDataCollections = (state: UiState) => {
  return {
    filledDataCollections: (state && state.filledDataCollections) ? state.filledDataCollections : [],
    availableDcLength: (state && state.dataCollections) ? state.dataCollections.length : 0
  }
};
export const getWidgetStatus = (state: UiState) => {
  const chatVisible = (state && state.mediaChange && state.mediaChange.Chat &&
                       state.mediaChange.Chat.rx && state.mediaChange.Chat.tx);
  console.log('getWidgetStatus', state);

  return {
    loadingPanel: {
      visible: state.loading
    },
    closePanel: {
      visible: false
    },
    topBar: {
      title: 'Assistente personale',
      subtitle: 'Chat in corso',
      avatarSrc: './assets/static/bot_avatar.png',
      useAvatar: false,
      canMaximize: true,
      canMinimize: true,
      canStartAudio: true,
      canStartVideo: true
    },
    chat: {
      showEmojiPanel: false,
      showEmoji: true,
      showUpload: true,
      showSendButton: true
    },
    messages: [
      { type: 'system', text: 'Sei in contatto con <br><b>Irene Chiappalona</b>'},
      { type: 'chat', text: 'Hello how can I help you?', isAgent: true },
      { type: 'chat', text: 'Ciao', isAgent: false },
      { type: 'quick-reply', body: 'Seleziona un colore', quick_replies: [ { title: 'Red'}, { title: 'Blu'}, { title: 'Green'} ] },
      { type: 'template', templateId:'generic', body: 'Seleziona un colore', elements:  [
          {
            "title": "You can send me the following messages",
            "buttons": [
              {
                "type": "postback",
                "title": "quick",
                "payload": "quick"
              },
              {
                "type": "postback",
                "title": "team",
                "payload": "team"
              },
              {
                "type": "postback",
                "title": "cat",
                "payload": "cat"
              },
              {
                "type": "postback",
                "title": "cats",
                "payload": "cats"
              },
              {
                "type": "postback",
                "title": "tm-buttons",
                "payload": "tm-buttons"
              },
              {
                "type": "postback",
                "title": "tm-elements",
                "payload": "tm-elements"
              },
              {
                "type": "postback",
                "title": "bye",
                "payload": "bye"
              },
              {
                "type": "postback",
                "title": "transfer",
                "payload": "transfer"
              },
              {
                "type": "postback",
                "title": "pagevent",
                "payload": "pagevent"
              }
            ]
          }
        ]
      }
    ]
  }
}