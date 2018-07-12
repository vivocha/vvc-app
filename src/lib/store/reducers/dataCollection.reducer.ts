import {DataCollectionCompleted, DataCollectionState} from '../models.interface';
import * as fromDataCollection from '../actions/dataCollection.actions';


const initialState: DataCollectionState = {
  items: {},
  completed: false
};

export function reducer(state: DataCollectionState = initialState, action: fromDataCollection.DataCollectionActions){
  switch (action.type){
    case fromDataCollection.DC_INITIALIZED: {
      return Object.assign({}, state, { ...state, ...action.payload });
    }
    case fromDataCollection.DC_ADDED: {
      const items = { ...state.items, [action.payload.id]: action.payload };
      return Object.assign({}, state, { items: items });
    }
    case fromDataCollection.DC_END: {
      return Object.assign({}, state, { lastCompleted: action.payload });
    }
    case fromDataCollection.DC_SELECTED: {
      return Object.assign({}, state, {
        selectedItem: { dc: action.payload.dc, type: action.payload.type },
        completed: false });
    }
    case fromDataCollection.DC_RESOLVED: {
      return Object.assign({}, state, { completed: true });
    }
    case fromDataCollection.DC_SHOW_PANEL: {
      return Object.assign({}, state, { showDataCollectionPanel: action.payload});
    }
    default:
      return state;
  }
}

export const getCompletedDC = (state: DataCollectionState): DataCollectionCompleted => state.lastCompleted;

