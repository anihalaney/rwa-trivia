import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../app-store';
import { Question, User, SearchResults, SearchCriteria, FileTrack } from '../../../model';
import { ActionWithPayload, FileSummaryActions } from '../actions';
import { FileSummaryService } from '../../services'

@Injectable()
export class FileSummaryEffects {
    constructor(
        private actions$: Actions,
        private Actions: FileSummaryActions,
        private svc: FileSummaryService
    ) { }

    @Effect()
    addFileTrackRecord$ = this.actions$
        .ofType(FileSummaryActions.ADD_File_Track_Record)
        .do((action: ActionWithPayload<FileTrack>) => this.svc.addFileRecord(action.payload))
        .filter(() => false);
            
}
