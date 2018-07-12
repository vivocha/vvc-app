import {RecontactState} from '../models.interface';
import * as fromRecontact from '../actions/recontact.actions';

const initialState: RecontactState = {
  completed: false
};

export function reducer(state: RecontactState = initialState, action: fromRecontact.RecontactActions){
  switch (action.type){
    case fromRecontact.RECONTACT_COMPLETED: {
      return Object.assign({}, state, { ...state, completed: true });
    }
    case fromRecontact.RECONTACT_SELECTED: {
      return Object.assign({}, state, { item: action.payload });
    }
    default:
      return state;
  }
}
