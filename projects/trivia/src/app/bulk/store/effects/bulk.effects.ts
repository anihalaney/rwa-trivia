import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs';

import { BulkService, QuestionService } from '../../../../../../shared-library/src/lib/core/services';
import { BulkUploadFileInfo, Question } from '../../../../../../shared-library/src/lib/shared/model';
import { BulkActionTypes } from '../actions';
import * as bulkActions from '../actions/bulk.actions';


@Injectable()
export class BulkEffects {



    // for get all BulkUploadFileInfo
    @Effect()
    loadBulkUpload$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD)
        .pipe(
            switchMap((action: bulkActions.LoadBulkUpload) =>
                this.bulkService.getBulkUpload(action.payload.user, action.payload.archive).pipe(
                    map((bulkUploadFileInfo: BulkUploadFileInfo[]) => new bulkActions.LoadBulkUploadSuccess(bulkUploadFileInfo))
                )
            )
        );

    // for get BulkUploadFileInfo by User
    @Effect()
    loadUserBulkUpload$ = this.actions$
        .ofType(BulkActionTypes.LOAD_USER_BULK_UPLOAD)
        .pipe(
            switchMap((action: bulkActions.LoadUserBulkUpload) =>
                this.bulkService.getUserBulkUpload(action.payload.user, action.payload.archive).pipe(
                    map((bulkUploadFileInfo: BulkUploadFileInfo[]) => new bulkActions.LoadUserBulkUploadSuccess(bulkUploadFileInfo))
                )
            )
        );

    // for file PublishedQuestions by BulkUpload Id
    @Effect()
    loadBulkUploadPublishedQuestions$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS)
        .pipe(
            switchMap((action: bulkActions.LoadBulkUploadPublishedQuestions) =>
                this.questionService.getQuestionsForBulkUpload(action.payload.bulkUploadFileInfo, true).pipe(
                    map((questions: Question[]) => new bulkActions.LoadBulkUploadPublishedQuestionsSuccess(questions))
                )
            )
        );

    // for file UnPublishedQuestions by BulkUpload Id
    @Effect()
    loadBulkUploadUnpublishedQuestions$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS)
        .pipe(
            switchMap((action: bulkActions.LoadBulkUploadUnpublishedQuestions) =>
                this.questionService.getQuestionsForBulkUpload(action.payload.bulkUploadFileInfo, false).pipe(
                    map((questions: Question[]) => new bulkActions.LoadBulkUploadUnpublishedQuestionsSuccess(questions))
                )
            )
        );

    // for update Question
    @Effect()
    updateQuestion$ = this.actions$
        .ofType(BulkActionTypes.UPDATE_QUESTION)
        .pipe(
            switchMap((action: bulkActions.UpdateQuestion) => {
                this.questionService.saveQuestion(action.payload.question);
                return empty();
            })
        );

    @Effect()
    loadBulkUploadFileUrl$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD_FILE_URL)
        .pipe(
            switchMap((action: bulkActions.LoadBulkUploadFileUrl) =>
                this.bulkService.getFileByBulkUploadFileUrl(action.payload.bulkUploadFileInfo).pipe(
                    map((url: string) => new bulkActions.LoadBulkUploadFileUrlSuccess(url))
                )
            )
        );

    // for Update BulkUpload
    @Effect()
    updateBulkUpload$ = this.actions$
        .ofType(BulkActionTypes.UPDATE_BULK_UPLOAD)
        .pipe(
            switchMap((action: bulkActions.UpdateBulkUpload) => {
                this.bulkService.updateBulkUpload(action.payload.bulkUploadFileInfo);
                return empty();
            })
        );


    // for add Bulk Questions
    @Effect()
    addBulkQuestions$ = this.actions$
        .ofType(BulkActionTypes.ADD_BULK_QUESTIONS)
        .pipe(
            switchMap((action: bulkActions.AddBulkQuestions) => {
                this.questionService.saveBulkQuestions(action.payload.bulkUpload);
                return empty();
            })
        );
    // for add Bulk Questions
    @Effect()
    archiveUserBulkUpload$ = this.actions$
        .ofType(BulkActionTypes.ARCHIVE_BULK_UPLOAD)
        .pipe(
            switchMap((action: bulkActions.ArchiveBulkUpload) =>
                this.bulkService.archiveBulkUpload(action.payload.archiveArray, action.payload.user).then(ref => {
                    return new bulkActions.ArchiveBulkUploadSuccess();
                })
            ));

    // for get bulk object based on Id
    @Effect()
    getBulkUpload$ = this.actions$
        .ofType(BulkActionTypes.LOAD_BULK_UPLOAD_FILE)
        .pipe(
            switchMap((action: bulkActions.LoadBulkUploadFile) =>
                this.bulkService.getBulkUploadFile(action.payload.bulkId).pipe(
                    map((bulkUploadFileInfo: BulkUploadFileInfo) => new bulkActions.LoadBulkUploadFileSuccess(bulkUploadFileInfo)))
            ));

    constructor(
        private actions$: Actions,
        private bulkService: BulkService,
        private questionService: QuestionService,
    ) { }
}
