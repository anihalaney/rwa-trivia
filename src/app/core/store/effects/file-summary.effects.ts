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

    // @Effect()
    // addFileTrackRecord$ = this.actions$
    //     .ofType(FileSummaryActions.ADD_File_Track_Record)
    //     .do((action: ActionWithPayload<FileTrack>) => this.svc.addFileRecord(action.payload))
    //     .filter(() => false);
            
    // @Effect()
    // loadUserPublishedQuestions$ = this.actions$
    //     .ofType(FileSummaryActions.LOAD_FILE_RECORD)
    //     .switchMap((action: ActionWithPayload<User>) => this.svc.getUserQuestions(action.payload, true))
    //     .map((questions: Question[]) => this.questionActions.loadUserPublishedQuestionsSuccess(questions));


    @Effect() 
    loadFileRecord$ = this.actions$
        .ofType(FileSummaryActions.LOAD_FILE_RECORD)
        .switchMap(() => this.svc.loadFileRecord())
        .map((fileTrack: FileTrack[]) => this.Actions.loadFileRecordSuccess(fileTrack))
}
