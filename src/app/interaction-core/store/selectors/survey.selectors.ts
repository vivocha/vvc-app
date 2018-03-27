import * as fromSurvey from '../reducers/survey.reducer';
import * as fromFeature from '../reducers';
import {createSelector} from '@ngrx/store';

export const getSurveyCompleted = createSelector(
  fromFeature.getSurveyState,
  fromSurvey.getSurveyCompleted
);