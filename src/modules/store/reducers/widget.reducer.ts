import {WidgetState} from '../models.interface';
import * as fromWidget from '../actions/widget.actions';


const initialState: WidgetState = {
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

function extractInitialOpts(opts){
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
    mobile: false
  };
  return newOpts;
}
function extractStateFromMedia(payload){
    const newState: {
      state?: string;
      chat?: boolean,
      had_chat?: boolean,
      voice?: boolean,
      voice_rx?: boolean,
      voice_tx?: boolean,
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
        newState.voice_rx = payload.Voice['data']['rx_stream'];
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
  }
export function reducer(state: WidgetState = initialState, action: fromWidget.WidgetActions){
  switch(action.type){
    case fromWidget.INITIAL_DATA: {
      const dcList = {};
      dcList[action.payload.id] = action.payload;
      return Object.assign({}, state, {
        state: 'waiting_data',
        initialDataFilled: false,
        hasDataCollection: true,
        selectedDataCollectionId: action.payload.id,
        dataCollections: Object.assign({}, state.dataCollections, dcList)
      });
    }
    case fromWidget.ADD_DATA_COLLECTION: {
      const newDc = {};
      newDc[action.payload.id] = action.payload;
      return Object.assign({}, state, {
        dataCollections: Object.assign({}, state.dataCollections, newDc)
      });
    }
    case fromWidget.MERGE_DATA_COLLECTION: {
      const dataCollectionWithValue = {};
      dataCollectionWithValue[action.payload.id] = action.payload;
      return Object.assign({}, state, {
        dataCollections: Object.assign({}, state.dataCollections, dataCollectionWithValue)
      });
    }
    case fromWidget.INITIAL_DATA_SENT: {
      return Object.assign({}, state, {state: 'queue', initialDataFilled: true});
    }
    case fromWidget.INITIAL_OFFER: {
      const initialState = extractStateFromMedia(action.payload.offer);
      const initialOpts = extractInitialOpts(action.payload.context);
      initialState.state = 'queue';
      if (initialState.video && state.mobile) {
        initialState.fullScreen = true;
      } else if (!initialState.video) {
        initialState.fullScreen = false;
      }
      return Object.assign({}, state, initialState, initialOpts);
    }
    case fromWidget.REMOTE_CAPS: {
      return Object.assign({}, state, { remoteCaps: action.payload });
    }
    case fromWidget.LOCAL_CAPS: {
      return Object.assign({}, state, { localCaps: action.payload });
    }
    case fromWidget.MEDIA_CHANGE: {
      const newState = extractStateFromMedia(action.payload);
      if (newState.video && state.mobile) {
        newState.fullScreen = true;
      } else if (!newState.video) {
        newState.fullScreen = false;
      }
      return Object.assign({}, state, newState);
    }
    case fromWidget.MEDIA_OFFERING: {
      return Object.assign({}, state, { mediaOffering: action.payload });
    }
    case fromWidget.JOINED: {
      if (action.payload) {
        return Object.assign({}, state, { agent: action.payload, state: 'ready' });
      }
      return Object.assign({}, state, { state: 'ready' });
    }
    case fromWidget.FULLSCREEN: {
      return Object.assign({}, state, { fullScreen: action.payload });
    }
    case fromWidget.MUTE : {
      return Object.assign({}, state, { mute: action.payload});
    }
    case fromWidget.MUTE_IN_PROGRESS : {
      return Object.assign({}, state, { mute_in_progress: action.payload});
    }
    case fromWidget.CHATVISIBILITY: {
      return Object.assign({}, state, { chatVisibility: action.payload });
    }
    case fromWidget.REDUCE_TOPBAR: {
      return Object.assign({}, state, { topBarExpanded: false });
    }
    case fromWidget.SHOW_DATA_COLLECTION: {
      return Object.assign({}, state, { dataCollectionPanel: action.payload });
    }
    case fromWidget.SHOW_SURVEY: {
      const dataCollections = {};
      dataCollections[action.payload.id] = action.payload;
      return Object.assign({}, state, {
        showSurvey: true,
        surveyId: action.payload.id,
        dataCollections: Object.assign({}, state.dataCollections, dataCollections)
      });
    }
    case fromWidget.AGENT_IS_WRITING: {
      return Object.assign({}, state, { isAgentWriting: action.payload });
    }
    case fromWidget.CLOSE_CONTACT: {
      return Object.assign({}, state, { closed: action.payload, isAgentWriting: false });
    }
    case fromWidget.MINIMIZE: {
      return Object.assign({}, state, { minimized: action.payload, not_read: 0});
    }
    case fromWidget.INCREMENT_NOT_READ: {
      const not_read = state.not_read + 1;
      return Object.assign({}, state, { not_read: not_read });
    }
    case fromWidget.RESET_NOT_READ: {
      return Object.assign({}, state, { not_read: 0 });
    }
    default: return state;
  }
}

export const getWidget = (state: WidgetState) => state;