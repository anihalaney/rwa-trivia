import { Injectable } from '@angular/core';
import { map, filter, switchMap, exhaustMap } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { TopicActions, ActionWithPayload } from '../actions';
import { Topic, RouterStateUrl } from '../../../shared/model';
import { TopicService } from '../../services';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class TopicEffects {

    @Effect()
    getTopTopics$ = this.actions$
        .pipe(ofType(TopicActions.LOAD_TOP_TOPICS))
        .pipe(
            switchMap(() => this.svc.getTopTopics()),
            map((topics: any[]) => this.topicActions.loadTopTopicsSuccess(topics))
        );

    constructor(
        private actions$: Actions,
        private topicActions: TopicActions,
        private svc: TopicService
    ) { }
}
