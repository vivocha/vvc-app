import { ContextState } from '../models.interface';
import * as fromContext from '../actions/context.actions';

const initialState: ContextState = {
  loaded: false
};

export function reducer(state: ContextState = initialState, action: fromContext.ContextActions){
  switch (action.type){
    case fromContext.LOAD_CONTEXT_SUCCESS: {
      return Object.assign({}, state, action.payload);
    }
    default: return state;
  }
}

export const getContextRedux = (state: ContextState):ContextState => state;