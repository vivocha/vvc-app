import {createSelector, MemoizedSelector} from '@ngrx/store';
import {SurveyState} from '../models.interface';

import {getSurveyState} from '../reducers/main.reducer';
import {getSurveyCompletedRedux} from '../reducers/survey.reducer';

export const getSurveyCompleted:MemoizedSelector<Object,SurveyState> = createSelector(
  getSurveyState,
  getSurveyCompletedRedux
);