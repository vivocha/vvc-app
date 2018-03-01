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