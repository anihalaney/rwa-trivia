import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../app-store';
import { TagActions } from '../actions';
import { TagService } from '../../services'

@Injectable()
export class TagEffects {
    constructor (
        private actions$: Actions,
        private tagActions: TagActions,
        private svc: TagService
    ) {}

    @Effect() 
    loadTags$ = this.actions$
        .ofType(TagActions.LOAD_TAGS)
        .switchMap(() => this.svc.getTags())
        .map((tags: string[]) => this.tagActions.loadTagsSuccess(tags))

}
