import {SurveyState} from '../models.interface';
import * as fromSurvey from '../actions/survey.actions';

const initialState: SurveyState = {
  completed: false
};

export function reducer(state: SurveyState = initialState, action: fromSurvey.SurveyActions){
  switch (action.type){
    case fromSurvey.SURVEY_COMPLETED: {
      return Object.assign({}, state, { completed: true, surveyToSend: action.payload });
    }
    case fromSurvey.SURVEY_SELECTED: {
      return Object.assign({}, state, { selected: action.payload });
    }
    default:
      return state;
  }
}

export const getSurveyCompleted = (state: SurveyState) => state;