import {VvcWidgetState, VvcMessage, VvcDataCollection} from './core.interfaces';
const initialWidgetState: VvcWidgetState = {
    chat: false,
    chatVisibility: true,
    closed: false,
    dataCollections: {},
    error: false,
    fullScreen: false,
    lastError: '',
    state: 'initializing',
    mediaOffering: false,
    minimized: false,
    mute: false,
    mute_in_progress: false,
    mobile: false,
    not_read: 0,
    sharing: false,
    topBarExpanded: true,
    video: false,
    voice: false
};
function extractInitialOpts(opts) {
    const newOpts: {
        canAddVideo: boolean,
        canAddVoice: boolean,
        hasSurvey: boolean,
        surveyId: string,
        askForTranscript: boolean,
        mobile: boolean
    } = {
        canAddVideo: (opts.media && opts.media.Video && opts.media.Video === 'visitor'),
        canAddVoice: (opts.media && opts.media.Voice && opts.media.Voice === 'visitor'),
        hasSurvey: !!(opts.survey),
        surveyId: (opts.survey && opts.survey.dataToCollect),
        askForTranscript: (opts.survey && opts.survey.sendTranscript === 'ask'),
        mobile: !!(opts.mobile)
    };
    return newOpts;
};
function extractStateFromMedia(payload) {
  const newState: {
      state?: string;
      chat?: boolean,
      had_chat?: boolean,
      voice?: boolean,
      video?: boolean,
      video_rx?: boolean,
      video_tx?: boolean,
      sharing?: boolean,
      fullScreen?: boolean
  } = {
      chat: false,
      voice: false,
      video: false,
      video_rx: undefined,
      video_tx: undefined,
      sharing: false,
  };
  if (payload.Chat && payload.Chat['tx'] && payload.Chat['rx']) {
    newState.chat = true;
    newState.had_chat = true;
  }
  if (payload.Sharing && payload.Sharing['tx'] && payload.Sharing['rx']) {
    newState.sharing = true;
  }
  if (payload.Voice && payload.Voice['tx'] && payload.Voice['rx']) {
      if (payload.Voice['data']
      && payload.Voice['data']['tx_stream']
      && payload.Voice['data']['rx_stream']) {
          newState.voice = true;
      }
  }
  if (payload.Video && (payload.Video['tx'] || payload.Video['rx'])) {
    if (payload.Video['data'] && payload.Video['data']['rx_stream']) {
        newState.video_rx = payload.Video['data']['rx_stream'];
        newState.video = true;
    }
    if (payload.Video['data'] && payload.Video['data']['tx_stream']) {
        newState.video_tx = payload.Video['data']['tx_stream'];
        newState.video = true;
    }
  }
  return newState;
};
export function widgetState(state: VvcWidgetState  = initialWidgetState, {type, payload}) {
    console.log('------' + type + '------');
    if (type === 'MEDIA_CHANGE') {
        console.log(JSON.stringify(payload));
    }
    switch (type) {
        case 'INITIAL_DATA':
            const dcList = {};
            dcList[payload.id] = payload;
            return Object.assign({}, state, {
                state: 'waiting_data',
                initialDataFilled: false,
                hasDataCollection: true,
                selectedDataCollectionId: payload.id,
                dataCollections: Object.assign({}, state.dataCollections, dcList)
            });
        case 'ADD_DATA_COLLECTION':
            const newDc = {};
            newDc[payload.id] = payload;
            return Object.assign({}, state, {
                dataCollections: Object.assign({}, state.dataCollections, newDc)
            });
        case 'MERGE_DATA_COLLECTION':
            const dataCollectionWithValue = {};
            dataCollectionWithValue[payload.id] = payload;
            return Object.assign({}, state, {
                dataCollections: Object.assign({}, state.dataCollections, dataCollectionWithValue)
            });
        case 'INITIAL_DATA_SENT':
            return Object.assign({}, state, { state: 'queue', initialDataFilled: true });
        case 'INITIAL_OFFER':
            const initialState = extractStateFromMedia(payload.offer);
            const initialOpts = extractInitialOpts(payload.opts);
            initialState.state = 'queue';
            if (initialState.video && state.mobile) {
                initialState.fullScreen = true;
            } else if (!initialState.video) {
                initialState.fullScreen = false;
            }
            return Object.assign({}, state, initialState, initialOpts);
        case 'REMOTE_CAPS':
            return Object.assign({}, state, { remoteCaps: payload });
        case 'LOCAL_CAPS':
            return Object.assign({}, state, { localCaps: payload });
        case 'MEDIA_CHANGE':
            const newState = extractStateFromMedia(payload);
            if (newState.video && state.mobile) {
                newState.fullScreen = true;
            } else if (!newState.video) {
                newState.fullScreen = false;
            }
            return Object.assign({}, state, newState);
        case 'MEDIA_OFFERING':
            return Object.assign({}, state, { mediaOffering: payload });
        case 'JOINED':
            if (payload) {
                return Object.assign({}, state, { agent: payload, state: 'ready' });
            }
            return Object.assign({}, state, { state: 'ready' });
        case 'FULLSCREEN':
            return Object.assign({}, state, { fullScreen: payload });
        case 'MUTE':
            return Object.assign({}, state, { mute: payload});
        case 'MUTE_IN_PROGRESS':
            return Object.assign({}, state, { mute_in_progress: payload});
        case 'CHATVISIBILITY':
            return Object.assign({}, state, { chatVisibility: payload });
        case 'REDUCE_TOPBAR':
            return Object.assign({}, state, { topBarExpanded: false });
        case 'SHOW_DATA_COLLECTION':
            return Object.assign({}, state, { dataCollectionPanel: payload });
        case 'SHOW_SURVEY':
            const dataCollections = {};
            dataCollections[payload.id] = payload;
            return Object.assign({}, state, {
                showSurvey: true,
                surveyId: payload.id,
                dataCollections: Object.assign({}, state.dataCollections, dataCollections)
            });
        case 'AGENT_IS_WRITING':
            return Object.assign({}, state, { isAgentWriting: payload });
        case 'CLOSE_CONTACT':
            return Object.assign({}, state, { closed: payload });
        case 'MINIMIZE':
            return Object.assign({}, state, { minimized: payload, not_read: 0});
        case 'INCREMENT_NOT_READ':
            const not_read = state.not_read + 1;
            return Object.assign({}, state, { not_read: not_read });
        default: return state;
    }
};
export function messages(messageArray: Array<VvcMessage> = [], {type, payload}) {
    switch (type) {
        case 'UPDATE_MESSAGE':
            const newArray = [];
            const iMessages = messageArray.filter( m => m.id === payload.id);
            iMessages[0].state = payload.state;
            messageArray.forEach( (m, i) => {
                if (i === iMessages[0].oPos) {
                    newArray.push(iMessages[0]);
                }
                if (m.id !== payload.id) {
                    newArray.push(m);
                }
            });
            return newArray;
        case 'NEW_MESSAGE':
            const isWritingMessages = messageArray.filter( m => m.state === 'iswriting');
            const incomingMessages = messageArray.filter( m => m.type === 'incoming-request' && m.state !== 'closed');
            let chatMessages = [];
            if (incomingMessages.length > 0) {
                chatMessages = messageArray.filter(m => m.state !== 'open').concat(incomingMessages);
            } else {
                chatMessages = messageArray;
            }
            if (payload.type === 'incoming-request') {
                payload.oPos = chatMessages.length;
            }
            return chatMessages
                        .filter (m => m.state !== 'iswriting')
                        .concat(payload, isWritingMessages);
        case 'REM_MESSAGE':
            return messageArray.filter( m => m.id !== payload.id);
        case 'REM_IS_WRITING':
            return messageArray.filter( m => m.state !== 'iswriting');
        default: return messageArray;
    }
};

