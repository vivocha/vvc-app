import {DataCollectionState} from '../models.interface';
import * as fromDataCollection from '../actions/dataCollection.actions';


const initialState: DataCollectionState = {
  completed: false
};

export function reducer(state: DataCollectionState = initialState, action: fromDataCollection.DataCollectionActions){
  switch (action.type){
    case fromDataCollection.DC_LOADED: {
      return Object.assign({}, state, { list: [...action.payload] });
    }
    case fromDataCollection.DC_COMPLETED: {
      return Object.assign({}, state, { completed: true, creationOptions: action.payload });
    }
    case fromDataCollection.DC_SELECTED: {
      return Object.assign({}, state, { selected: action.payload });
    }
    default:
      return state;
  }
}

export const getDataCollectionCompleted = (state: DataCollectionState) => state;

