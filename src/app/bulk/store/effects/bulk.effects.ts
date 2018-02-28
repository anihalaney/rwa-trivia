import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { BulkUploadFileInfo, Question } from '../../../model';
import { BulkActions, BulkActionTypes } from '../actions';
import * as bulkactions from '../actions/bulk.actions';
import { BulkService, QuestionService } from '../../../core/services';

@Injectable()
export class BulkEffects {
    constructor(
        private actions$: Actions,
        private bulkService: BulkService,
        private questionService: QuestionService,
    ) { }


    // for get all BulkUploadFileInfo
    @Effect()
    loadBulkUpload$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD)
        .pipe(
        switchMap((action: bulkactions.LoadBulkUpload) =>
            this.bulkService.getBulkUpload().pipe(
                map((bulkUploadFileInfo: BulkUploadFileInfo[]) => new bulkactions.LoadBulkUploadSuccess(bulkUploadFileInfo))
            )
        )
        );

    // for get BulkUploadFileInfo by User
    @Effect()
    loadUserBulkUpload$ = this.actions$
        .ofType(BulkActionTypes.LOAD_USER_BULK_UPLOAD)
        .pipe(
        switchMap((action: bulkactions.LoadUserBulkUpload) =>
            this.bulkService.getUserBulkUpload(action.payload.user).pipe(
                map((bulkUploadFileInfo: BulkUploadFileInfo[]) => new bulkactions.LoadUserBulkUploadSuccess(bulkUploadFileInfo))
            )
        )
        );

    // for file PublishedQuestions by BulkUpload Id
    @Effect()
    loadBulkUploadPublishedQuestions$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS)
        .pipe(
        switchMap((action: bulkactions.LoadBulkUploadPublishedQuestions) =>
            this.questionService.getQuestionsForBulkUpload(action.payload.bulkUploadFileInfo,true).pipe(
                map((questions: Question[]) => new bulkactions.LoadBulkUploadPublishedQuestionsSuccess(questions))
            )
        )
        );

    // for file UnPublishedQuestions by BulkUpload Id
    @Effect()
    loadBulkUploadUnpublishedQuestions$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS)
        .pipe(
        switchMap((action: bulkactions.LoadBulkUploadUnpublishedQuestions) =>
            this.questionService.getQuestionsForBulkUpload(action.payload.bulkUploadFileInfo,false).pipe(
                map((questions: Question[]) => new bulkactions.LoadBulkUploadUnpublishedQuestionsSuccess(questions))
            )
        )
        );
}