import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getTopTopics  = createSelector(fromFeature.coreState, (state: fromFeature.CoreState) => state.topTopics);
