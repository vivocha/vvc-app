import {VvcWidgetState} from './core.interfaces';
const initialWidgetState: VvcWidgetState = {
    chat: false,
    error: false,
    fullScreen: false,
    lastError: '',
    loading: true,
    mute: false,
    mobile: false,
    sharing: false,
    video: false,
    voice: false
};
const extractStateFromMedia = (payload) => {
  const newState: { chat?: boolean, voice?: boolean, video?: boolean, sharing?: boolean} = {};
  if (payload.Chat && payload.Chat['tx'] && payload.Chat['rx']) {
    newState.chat = true;
  }
  if (payload.Sharing && payload.Sharing['tx'] && payload.Sharing['rx']) {
    newState.sharing = true;
  }
  if (payload.Voice && payload.Voice['tx'] && payload.Voice['rx']) {
    newState.voice = true;
  }
  if (payload.Video && (payload.Video['tx'] || payload.Video['rx'])) {
    newState.video = true;
  }
  return newState;
};
const isIncomingRequest = (state, offer) : { askForConfirmation: boolean, offer: any} => {
    const resp = { askForConfirmation : false, offer: {} };
    for (const i in offer) {
        switch (i) {
            case 'Chat':
            case 'Sharing':
            case 'Voice':
                if (!state[i.toLowerCase()]
                    && offer[i]['tx'] !== 'off'
                    && offer[i]['rx'] !== 'off') {
                    resp.askForConfirmation = true;
                    resp.offer[i] = offer[i];
                }
                break;
            case 'Video':
                if (!state[i.toLowerCase()]
                    && ( offer[i]['tx'] !== 'off' || offer[i]['rx'] !== 'off')) {
                    resp.askForConfirmation = true;
                    resp.offer[i] = offer[i];
                }
                break;
        }
    }
    return resp;
};
export const widgetState = (state: VvcWidgetState  = initialWidgetState, {type, payload}) => {
    switch (type) {
        case 'INITIAL_OFFER':
        case 'MEDIA_CHANGE':
            const newState = extractStateFromMedia(payload);
            return Object.assign({}, state, newState);
        case 'JOINED':
            if (payload) {
                console.log(payload);
            }
            return Object.assign({}, state, { loading: false });
        case 'MEDIA_OFFER':
            const confirmation = isIncomingRequest(state, payload);
            if (confirmation.askForConfirmation) {
                console.log('should emit an incoming request', confirmation.offer);
                // incomingRequest(null, {type: 'INCOMING_REQUEST', payload: confirmation.offer});
                return Object.assign({}, state, { incomingRequest: true, incomingOffer: confirmation.offer });
            } else {
                console.log('should merge and go');
            }
            return state;
        default: return state;
    }
};
