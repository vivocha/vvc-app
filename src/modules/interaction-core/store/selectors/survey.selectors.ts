import * as fromSurvey from '../reducers/survey.reducer';
import * as fromFeature from '../reducers';
import {createSelector, MemoizedSelector} from '@ngrx/store';
import {SurveyState} from '../models.interface';

export const getSurveyCompleted:MemoizedSelector<Object,SurveyState> = createSelector(
  fromFeature.getSurveyState,
  fromSurvey.getSurveyCompleted
);